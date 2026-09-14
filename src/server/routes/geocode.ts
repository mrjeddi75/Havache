import { Router, type Request, type Response } from "express";
import type { GeocodeSuggestion } from "../types/weather.js";
import { TtlCache } from "../utils/cache.js";

const router = Router();

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const SUGGESTIONS_CACHE_TTL_MS = 10 * 60 * 1000;
const suggestionsCache = new TtlCache<GeocodeSuggestion[]>(SUGGESTIONS_CACHE_TTL_MS);

interface OpenMeteoGeocodeResponse {
  results?: Array<{
    name: string;
    admin1?: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
}

router.get("/geocode", async (req: Request, res: Response) => {
  const query = typeof req.query.query === "string" ? req.query.query.trim() : "";

  if (query.length < 2) {
    res.json([]);
    return;
  }

  const cacheKey = query.toLowerCase();
  const cached = suggestionsCache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const url = new URL(GEOCODE_URL);
    url.searchParams.set("name", query);
    url.searchParams.set("count", "5");
    url.searchParams.set("language", "fa");
    url.searchParams.set("format", "json");

    const response = await fetch(url);
    if (!response.ok) {
      res.json([]);
      return;
    }

    const data = (await response.json()) as OpenMeteoGeocodeResponse;
    const suggestions: GeocodeSuggestion[] = (data.results ?? []).map((r) => ({
      name: r.name,
      admin1: r.admin1,
      country: r.country,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
    }));

    suggestionsCache.set(cacheKey, suggestions);
    res.json(suggestions);
  } catch (err) {
    console.error("Autocomplete lookup failed:", err);
    res.json([]);
  }
});

export default router;
