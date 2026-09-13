import { Router, type Request, type Response } from "express";
import type {
  ApiErrorBody,
  CurrentWeather,
  DailyEntry,
  GeocodeResult,
  HourlyEntry,
  WeatherResponse,
} from "../types/weather.js";

const router = Router();

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/**
 * Open-Meteo is free and keyless for the endpoints this app uses.
 * WEATHER_API_KEY is read here for forward-compatibility (e.g. if the
 * deployment is later pointed at a provider that requires one) but is
 * not required for the app to function.
 */
const WEATHER_API_KEY = process.env.WEATHER_API_KEY ?? "";

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

interface OpenMeteoForecastResponse {
  current: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
    visibility?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    wind_speed_10m_max: number[];
  };
}

function sendError(res: Response, status: number, body: ApiErrorBody): void {
  res.status(status).json(body);
}

async function geocodeCity(cityName: string): Promise<GeocodeResult | null> {
  const url = new URL(GEOCODE_URL);
  url.searchParams.set("name", cityName);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "fa");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoGeocodeResponse;
  const first = data.results?.[0];
  if (!first) return null;

  return {
    name: first.name,
    admin1: first.admin1,
    country: first.country,
    latitude: first.latitude,
    longitude: first.longitude,
    timezone: first.timezone,
  };
}

async function fetchForecast(location: GeocodeResult): Promise<OpenMeteoForecastResponse> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(location.latitude));
  url.searchParams.set("longitude", String(location.longitude));
  url.searchParams.set("timezone", location.timezone);
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "surface_pressure",
      "wind_speed_10m",
      "wind_direction_10m",
      "weather_code",
      "is_day",
      "visibility",
    ].join(",")
  );
  url.searchParams.set(
    "hourly",
    ["temperature_2m", "weather_code", "precipitation_probability", "is_day"].join(",")
  );
  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
      "uv_index_max",
      "wind_speed_10m_max",
    ].join(",")
  );
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("wind_speed_unit", "kmh");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Forecast request failed with status ${response.status}`);
  }
  return (await response.json()) as OpenMeteoForecastResponse;
}

function buildCurrent(raw: OpenMeteoForecastResponse): CurrentWeather {
  const c = raw.current;
  return {
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    weatherCode: c.weather_code,
    isDay: c.is_day === 1,
    humidity: c.relative_humidity_2m,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    pressure: c.surface_pressure,
    uvIndex: raw.daily.uv_index_max[0] ?? 0,
    visibility: c.visibility ?? 0,
    time: c.time,
  };
}

function buildHourly(raw: OpenMeteoForecastResponse): HourlyEntry[] {
  const now = new Date(raw.current.time).getTime();
  const entries: HourlyEntry[] = raw.hourly.time.map((time, i) => ({
    time,
    temperature: raw.hourly.temperature_2m[i],
    weatherCode: raw.hourly.weather_code[i],
    precipitationProbability: raw.hourly.precipitation_probability[i] ?? 0,
    isDay: raw.hourly.is_day[i] === 1,
  }));

  // Keep the next 24 hours starting from the current hour.
  const fromNow = entries.filter((e) => new Date(e.time).getTime() >= now - 30 * 60 * 1000);
  return fromNow.slice(0, 24);
}

function buildDaily(raw: OpenMeteoForecastResponse): DailyEntry[] {
  return raw.daily.time.map((date, i) => ({
    date,
    weatherCode: raw.daily.weather_code[i],
    temperatureMax: raw.daily.temperature_2m_max[i],
    temperatureMin: raw.daily.temperature_2m_min[i],
    precipitationProbability: raw.daily.precipitation_probability_max[i] ?? 0,
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
    uvIndexMax: raw.daily.uv_index_max[i] ?? 0,
    windSpeedMax: raw.daily.wind_speed_10m_max[i] ?? 0,
  }));
}

router.get("/weather", async (req: Request, res: Response) => {
  const city = typeof req.query.city === "string" ? req.query.city.trim() : "";

  if (!city) {
    sendError(res, 400, {
      error: "missing_city",
      message: "نام شهر ارسال نشده است.",
    });
    return;
  }

  try {
    const location = await geocodeCity(city);
    if (!location) {
      sendError(res, 404, {
        error: "city_not_found",
        message: "شهری با این نام پیدا نشد. لطفاً نام را بررسی کنید.",
      });
      return;
    }

    const raw = await fetchForecast(location);

    const payload: WeatherResponse = {
      location: {
        name: location.name,
        region: location.admin1,
        country: location.country,
        timezone: location.timezone,
      },
      current: buildCurrent(raw),
      hourly: buildHourly(raw),
      daily: buildDaily(raw),
      fetchedAt: new Date().toISOString(),
    };

    res.json(payload);
  } catch (err) {
    console.error("Weather lookup failed:", err);
    sendError(res, 502, {
      error: "upstream_error",
      message: "دریافت اطلاعات آب‌وهوا با خطا مواجه شد. لطفاً دوباره تلاش کنید.",
    });
  }
});

export default router;
export { WEATHER_API_KEY };
