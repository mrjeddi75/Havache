/**
 * Shared data contracts between the server and the client.
 * Kept dependency-free so the same file's shapes can be mirrored
 * in the client bundle without importing server code into the browser.
 */

export interface GeocodeResult {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  time: string;
}

export interface HourlyEntry {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  isDay: boolean;
}

export interface DailyEntry {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  windSpeedMax: number;
}

export interface AirQuality {
  usAqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  category: string;
}

export interface ClimateComparison {
  avgMax: number;
  avgMin: number;
  diffFromAvgMax: number;
  yearsUsed: number;
}

export interface WeatherResponse {
  location: {
    name: string;
    region?: string;
    country: string;
    timezone: string;
  };
  current: CurrentWeather;
  hourly: HourlyEntry[];
  daily: DailyEntry[];
  airQuality: AirQuality | null;
  climateComparison: ClimateComparison | null;
  fetchedAt: string;
}

export interface GeocodeSuggestion {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface ApiErrorBody {
  error: string;
  message: string;
}
