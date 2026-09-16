import { Router, type Request, type Response } from "express";
import { CITIES } from "../../shared/cities.js";
import type { ApiErrorBody } from "../types/weather.js";
import { TtlCache } from "../utils/cache.js";

const router = Router();

const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const HIGHLIGHTS_CACHE_TTL_MS = 10 * 60 * 1000;
const highlightsCache = new TtlCache<HighlightsResponse>(HIGHLIGHTS_CACHE_TTL_MS);
const HIGHLIGHTS_CACHE_KEY = "highlights";

interface BatchLocationResult {
  current?: {
    temperature_2m: number;
    weather_code: number;
  };
}

interface CityExtreme {
  name: string;
  temperature: number;
  weatherCode: number;
}

interface HighlightsResponse {
  hottest: CityExtreme | null;
  coldest: CityExtreme | null;
  cities: CityExtreme[];
  updatedAt: string;
}

/**
 * Open-Meteo accepts comma-separated latitude/longitude lists and returns
 * an array of per-location results — this fetches all 31 cities' current
 * temperature in a single request rather than 31 round trips.
 */
async function fetchBatchCurrent(): Promise<BatchLocationResult[]> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", CITIES.map((c) => c.lat).join(","));
  url.searchParams.set("longitude", CITIES.map((c) => c.lon).join(","));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Batch forecast request failed with status ${response.status}`);
  }

  const raw = await response.json();
  return Array.isArray(raw) ? (raw as BatchLocationResult[]) : [raw as BatchLocationResult];
}

router.get("/highlights", async (_req: Request, res: Response) => {
  const cached = highlightsCache.get(HIGHLIGHTS_CACHE_KEY);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const results = await fetchBatchCurrent();

    let hottest: CityExtreme | null = null;
    let coldest: CityExtreme | null = null;
    const cities: CityExtreme[] = [];

    results.forEach((result, index) => {
      const city = CITIES[index];
      if (!city || !result.current) return;

      const candidate: CityExtreme = {
        name: city.name,
        temperature: result.current.temperature_2m,
        weatherCode: result.current.weather_code,
      };

      cities.push(candidate);
      if (!hottest || candidate.temperature > hottest.temperature) hottest = candidate;
      if (!coldest || candidate.temperature < coldest.temperature) coldest = candidate;
    });

    const payload: HighlightsResponse = {
      hottest,
      coldest,
      cities,
      updatedAt: new Date().toISOString(),
    };

    highlightsCache.set(HIGHLIGHTS_CACHE_KEY, payload);
    res.json(payload);
  } catch (err) {
    console.error("Highlights lookup failed:", err);
    const body: ApiErrorBody = {
      error: "upstream_error",
      message: "دریافت اطلاعات شهرهای پرطرفدار با خطا مواجه شد.",
    };
    res.status(502).json(body);
  }
});

export default router;
