import { CITIES } from "../shared/cities.js";
import { TtlCache } from "./cache.js";
import type {
  AirQuality,
  ClimateComparison,
  CurrentWeather,
  DailyEntry,
  CityExtreme,
  GeocodeSuggestion,
  HighlightsResponse,
  HourlyEntry,
  WeatherResponse,
} from "./types.js";

/**
 * Talks to Open-Meteo directly from the browser (its endpoints are free,
 * keyless and CORS-enabled), so the whole site is static and can be hosted
 * on GitHub Pages / Cloudflare Pages with no server or database.
 */

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";

const MINUTE = 60 * 1000;
const weatherCache = new TtlCache<WeatherResponse>("weather", 10 * MINUTE);
const suggestionsCache = new TtlCache<GeocodeSuggestion[]>("suggest", 10 * MINUTE);
const highlightsCache = new TtlCache<HighlightsResponse>("highlights", 10 * MINUTE);
// Historical averages barely change within a day — cache generously.
const climateCache = new TtlCache<ClimateComparison | null>("climate", 24 * 60 * MINUTE);
const CLIMATE_YEARS_BACK = 10;

export const ERROR_CITY_NOT_FOUND = "شهری با این نام پیدا نشد. لطفاً نام را بررسی کنید.";
export const ERROR_UPSTREAM = "دریافت اطلاعات آب‌وهوا با خطا مواجه شد. لطفاً اینترنت خود را بررسی و دوباره تلاش کنید.";

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
    precipitation: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    wind_speed_10m_max: number[];
  };
}

interface OpenMeteoAirQualityResponse {
  current?: {
    us_aqi?: number;
    pm2_5?: number;
    pm10?: number;
  };
}

interface OpenMeteoArchiveResponse {
  daily?: {
    time: string[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
  };
}

async function geocodeCity(cityName: string): Promise<GeocodeSuggestion | null> {
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

async function fetchForecast(location: GeocodeSuggestion): Promise<OpenMeteoForecastResponse> {
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
    ["temperature_2m", "weather_code", "precipitation_probability", "precipitation", "is_day"].join(",")
  );
  url.searchParams.set(
    "daily",
    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_probability_max",
      "precipitation_sum",
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

function classifyUsAqi(aqi: number): string {
  if (aqi <= 50) return "پاک و سالم";
  if (aqi <= 100) return "قابل قبول";
  if (aqi <= 150) return "ناسالم برای گروه‌های حساس";
  if (aqi <= 200) return "ناسالم";
  if (aqi <= 300) return "بسیار ناسالم";
  return "خطرناک";
}

async function fetchAirQuality(location: GeocodeSuggestion): Promise<AirQuality | null> {
  try {
    const url = new URL(AIR_QUALITY_URL);
    url.searchParams.set("latitude", String(location.latitude));
    url.searchParams.set("longitude", String(location.longitude));
    url.searchParams.set("current", "us_aqi,pm2_5,pm10");
    url.searchParams.set("timezone", location.timezone);

    const response = await fetch(url);
    if (!response.ok) return null;

    const data = (await response.json()) as OpenMeteoAirQualityResponse;
    const current = data.current;
    if (!current || current.us_aqi === undefined) return null;

    return {
      usAqi: current.us_aqi,
      pm2_5: current.pm2_5 ?? null,
      pm10: current.pm10 ?? null,
      category: classifyUsAqi(current.us_aqi),
    };
  } catch (err) {
    console.error("Air quality lookup failed:", err);
    return null;
  }
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Compares today's forecast high against the historical average high for
 * this same calendar date over the past ~10 years, using Open-Meteo's
 * free Historical Weather (archive) API. One request spans the whole
 * 10-year window and the matching calendar day is filtered out
 * client-side (server-side, technically) — far cheaper than one request
 * per year.
 */
async function fetchClimateComparison(
  location: GeocodeSuggestion,
  todayMax: number
): Promise<ClimateComparison | null> {
  try {
    const today = new Date();
    const monthDay = toIsoDate(today).slice(5); // "MM-DD"

    const startDate = new Date(today);
    startDate.setFullYear(today.getFullYear() - CLIMATE_YEARS_BACK);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - 1); // archive API doesn't include today

    const cacheKey = `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)},${monthDay}`;
    const cached = climateCache.get(cacheKey);
    if (cached !== undefined) return cached;

    const url = new URL(ARCHIVE_URL);
    url.searchParams.set("latitude", String(location.latitude));
    url.searchParams.set("longitude", String(location.longitude));
    url.searchParams.set("start_date", toIsoDate(startDate));
    url.searchParams.set("end_date", toIsoDate(endDate));
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min");
    url.searchParams.set("timezone", location.timezone);

    const response = await fetch(url);
    if (!response.ok) {
      climateCache.set(cacheKey, null);
      return null;
    }

    const data = (await response.json()) as OpenMeteoArchiveResponse;
    const daily = data.daily;
    if (!daily) {
      climateCache.set(cacheKey, null);
      return null;
    }

    const maxes: number[] = [];
    const mins: number[] = [];
    daily.time.forEach((date, i) => {
      if (!date.endsWith(monthDay)) return;
      const max = daily.temperature_2m_max[i];
      const min = daily.temperature_2m_min[i];
      if (max !== null && max !== undefined) maxes.push(max);
      if (min !== null && min !== undefined) mins.push(min);
    });

    if (maxes.length === 0) {
      climateCache.set(cacheKey, null);
      return null;
    }

    const avgMax = maxes.reduce((a, b) => a + b, 0) / maxes.length;
    const avgMin = mins.length > 0 ? mins.reduce((a, b) => a + b, 0) / mins.length : avgMax;

    const result: ClimateComparison = {
      avgMax: Math.round(avgMax * 10) / 10,
      avgMin: Math.round(avgMin * 10) / 10,
      diffFromAvgMax: Math.round((todayMax - avgMax) * 10) / 10,
      yearsUsed: maxes.length,
    };

    climateCache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.error("Climate comparison lookup failed:", err);
    return null;
  }
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
    precipitation: raw.hourly.precipitation[i] ?? 0,
    isDay: raw.hourly.is_day[i] === 1,
  }));

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
    precipitationSum: raw.daily.precipitation_sum[i] ?? 0,
    sunrise: raw.daily.sunrise[i],
    sunset: raw.daily.sunset[i],
    uvIndexMax: raw.daily.uv_index_max[i] ?? 0,
    windSpeedMax: raw.daily.wind_speed_10m_max[i] ?? 0,
  }));
}

function cacheKeyFor(location: GeocodeSuggestion): string {
  return `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
}

interface BatchLocationResult {
  current?: {
    temperature_2m: number;
    weather_code: number;
  };
}

async function loadWeatherFor(location: GeocodeSuggestion): Promise<WeatherResponse> {
  const cacheKey = cacheKeyFor(location);
  const cached = weatherCache.get(cacheKey);
  if (cached) return cached;

  try {
    const [raw, airQuality] = await Promise.all([fetchForecast(location), fetchAirQuality(location)]);
    const daily = buildDaily(raw);
    const todayMax = daily[0]?.temperatureMax ?? raw.current.temperature_2m;
    const climateComparison = await fetchClimateComparison(location, todayMax);

    const payload: WeatherResponse = {
      location: {
        name: location.name,
        region: location.admin1,
        country: location.country,
        timezone: location.timezone,
      },
      current: buildCurrent(raw),
      hourly: buildHourly(raw),
      daily,
      airQuality,
      climateComparison,
      fetchedAt: new Date().toISOString(),
    };

    weatherCache.set(cacheKey, payload);
    return payload;
  } catch (err) {
    console.error("Weather lookup failed:", err);
    throw new Error(ERROR_UPSTREAM);
  }
}

/** Weather for a city typed by name. Known provincial capitals skip geocoding entirely. */
export async function getWeatherByCity(cityName: string): Promise<WeatherResponse> {
  const name = cityName.trim();
  const known = CITIES.find((c) => c.name === name);

  let location: GeocodeSuggestion | null;
  if (known) {
    location = {
      name: known.name,
      admin1: known.province,
      country: "ایران",
      latitude: known.lat,
      longitude: known.lon,
      timezone: "Asia/Tehran",
    };
  } else {
    try {
      location = await geocodeCity(name);
    } catch (err) {
      console.error("Geocoding failed:", err);
      throw new Error(ERROR_UPSTREAM);
    }
  }

  if (!location) throw new Error(ERROR_CITY_NOT_FOUND);
  return loadWeatherFor(location);
}

/** Weather for a place picked from the autocomplete list (coordinates already known). */
export function getWeatherByLocation(location: GeocodeSuggestion): Promise<WeatherResponse> {
  return loadWeatherFor({ ...location, timezone: location.timezone || "auto" });
}

export async function getSuggestions(query: string): Promise<GeocodeSuggestion[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const cacheKey = q.toLowerCase();
  const cached = suggestionsCache.get(cacheKey);
  if (cached) return cached;

  try {
    const url = new URL(GEOCODE_URL);
    url.searchParams.set("name", q);
    url.searchParams.set("count", "5");
    url.searchParams.set("language", "fa");
    url.searchParams.set("format", "json");

    const response = await fetch(url);
    if (!response.ok) return [];

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
    return suggestions;
  } catch {
    return [];
  }
}

/**
 * Open-Meteo accepts comma-separated latitude/longitude lists and returns
 * an array of per-location results — all 31 cities' current temperature in
 * a single request.
 */
export async function getHighlights(): Promise<HighlightsResponse | null> {
  const cached = highlightsCache.get("all");
  if (cached) return cached;

  try {
    const url = new URL(FORECAST_URL);
    url.searchParams.set("latitude", CITIES.map((c) => c.lat).join(","));
    url.searchParams.set("longitude", CITIES.map((c) => c.lon).join(","));
    url.searchParams.set("current", "temperature_2m,weather_code");
    url.searchParams.set("timezone", "auto");
    url.searchParams.set("forecast_days", "1");

    const response = await fetch(url);
    if (!response.ok) return null;

    const raw = await response.json();
    const results: BatchLocationResult[] = Array.isArray(raw) ? raw : [raw];

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

    const payload: HighlightsResponse = { hottest, coldest, cities, updatedAt: new Date().toISOString() };
    highlightsCache.set("all", payload);
    return payload;
  } catch (err) {
    console.error("Highlights lookup failed:", err);
    return null;
  }
}
