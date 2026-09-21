import { describeWeatherCode, windDirectionLabel, conditionTip, type Category } from "./weatherCodes.js";
import { weatherIcon, windBadgeSvg } from "./icons.js";
import { cityIconSvg } from "./cityIcons.js";
import { CITIES } from "../shared/cities.js";
import { initTheme, toggleTheme } from "./theme.js";
import { classifyAqi } from "./aqi.js";
import { mascotSvg } from "./mascot.js";
import { heatColor } from "./heatColor.js";
import { windCompassSvg } from "./windCompass.js";

interface CurrentWeather {
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

interface HourlyEntry {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitation: number;
  isDay: boolean;
}

interface DailyEntry {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  windSpeedMax: number;
}

interface AirQuality {
  usAqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  category: string;
}

interface ClimateComparison {
  avgMax: number;
  avgMin: number;
  diffFromAvgMax: number;
  yearsUsed: number;
}

interface WeatherResponse {
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

interface GeocodeSuggestion {
  name: string;
  admin1?: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

interface ApiErrorBody {
  error: string;
  message: string;
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

const DEFAULT_CITY = "تبریز";
const WINDY_THRESHOLD_KMH = 35;
const FROST_THRESHOLD_C = 0;
const RAIN_WINDOW_MIN_PROBABILITY = 50;
const OUTLOOK_MIN_PROBABILITY = 10;
const SUGGESTIONS_DEBOUNCE_MS = 250;
const SUGGESTIONS_MIN_LENGTH = 2;

const els = {
  form: document.getElementById("search-form") as HTMLFormElement,
  input: document.getElementById("city-input") as HTMLInputElement,
  searchField: document.querySelector(".search__field") as HTMLElement,
  suggestions: document.getElementById("search-suggestions") as HTMLUListElement,
  status: document.getElementById("search-status") as HTMLParagraphElement,
  themeToggle: document.getElementById("theme-toggle") as HTMLButtonElement,

  quickCities: document.getElementById("quick-cities") as HTMLElement,
  quickCitiesToggle: document.getElementById("quick-cities-toggle") as HTMLButtonElement,

  stateLoading: document.getElementById("state-loading") as HTMLElement,
  stateError: document.getElementById("state-error") as HTMLElement,
  errorMessage: document.getElementById("error-message") as HTMLElement,
  weatherContent: document.getElementById("weather-content") as HTMLElement,

  hero: document.getElementById("hero") as HTMLElement,
  heroIcon: document.getElementById("hero-icon") as HTMLElement,
  heroTemp: document.getElementById("hero-temp") as HTMLElement,
  heroCondition: document.getElementById("hero-condition") as HTMLElement,
  heroLocation: document.getElementById("hero-location") as HTMLElement,
  heroFeelsLike: document.getElementById("hero-feels-like") as HTMLElement,
  heroUpdated: document.getElementById("hero-updated") as HTMLElement,
  heroTip: document.getElementById("hero-tip") as HTMLElement,
  heroMascot: document.getElementById("hero-mascot") as HTMLElement,
  heroOutlookIcon: document.getElementById("hero-outlook-icon") as HTMLElement,
  heroOutlookText: document.getElementById("hero-outlook-text") as HTMLElement,
  heroDaylength: document.getElementById("hero-daylength") as HTMLElement,

  aqiCard: document.getElementById("aqi-card") as HTMLElement,
  aqiCategory: document.getElementById("aqi-category") as HTMLElement,
  aqiNumber: document.getElementById("aqi-number") as HTMLElement,

  climateCard: document.getElementById("climate-card") as HTMLElement,
  climateText: document.getElementById("climate-text") as HTMLElement,

  bestDayCallout: document.getElementById("best-day-callout") as HTMLElement,
  weeklyPrecip: document.getElementById("weekly-precip") as HTMLElement,

  detailHumidity: document.getElementById("detail-humidity") as HTMLElement,
  detailWind: document.getElementById("detail-wind") as HTMLElement,
  detailWindDirection: document.getElementById("detail-wind-direction") as HTMLElement,
  detailWindCompass: document.getElementById("detail-wind-compass") as HTMLElement,
  detailPressure: document.getElementById("detail-pressure") as HTMLElement,
  detailUv: document.getElementById("detail-uv") as HTMLElement,
  detailVisibility: document.getElementById("detail-visibility") as HTMLElement,
  detailSunrise: document.getElementById("detail-sunrise") as HTMLElement,
  detailSunset: document.getElementById("detail-sunset") as HTMLElement,

  hourlyList: document.getElementById("hourly-list") as HTMLUListElement,
  hourlyChartCaption: document.getElementById("hourly-chart-caption") as HTMLElement,
  todayRainWindow: document.getElementById("today-rain-window") as HTMLElement,

  dailyList: document.getElementById("daily-list") as HTMLUListElement,
  dailyChartCaption: document.getElementById("daily-chart-caption") as HTMLElement,

  extremes: document.getElementById("extremes") as HTMLElement,
  extremeHotCity: document.getElementById("extreme-hot-city") as HTMLElement,
  extremeHotTemp: document.getElementById("extreme-hot-temp") as HTMLElement,
  extremeColdCity: document.getElementById("extreme-cold-city") as HTMLElement,
  extremeColdTemp: document.getElementById("extreme-cold-temp") as HTMLElement,
  heatmap: document.getElementById("heatmap") as HTMLElement,
  heatmapAnalysis: document.getElementById("heatmap-analysis") as HTMLElement,
};

const HERO_CATEGORY_CLASSES = ["hero--sunny", "hero--cloudy", "hero--fog", "hero--rain", "hero--snow", "hero--storm"];
const AQI_CLASSES = [
  "aqi-card--good",
  "aqi-card--moderate",
  "aqi-card--sensitive",
  "aqi-card--unhealthy",
  "aqi-card--very-unhealthy",
  "aqi-card--hazardous",
];
const CLIMATE_CLASSES = ["climate-card--warmer", "climate-card--cooler", "climate-card--normal"];
const BEST_DAY_IDEAL_TEMP = 24;

function showState(state: "loading" | "error" | "content"): void {
  els.stateLoading.classList.toggle("state-panel--hidden", state !== "loading");
  els.stateError.classList.toggle("state-panel--hidden", state !== "error");
  els.weatherContent.classList.toggle("state-panel--hidden", state !== "content");
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}

function formatWeekday(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fa-IR", { weekday: "long" });
}

function setHeroCategory(category: Category): void {
  els.hero.classList.remove(...HERO_CATEGORY_CLASSES);
  els.hero.classList.add(`hero--${category}`);
}

function renderOutlook(daily: DailyEntry[]): void {
  // Scan tomorrow through the end of the forecast for the first day with
  // meaningful precipitation, rather than only checking a single fixed day.
  const upcoming = daily.slice(1);
  const rainyDay = upcoming.find((entry) => entry.precipitationProbability >= OUTLOOK_MIN_PROBABILITY);

  if (!rainyDay) {
    els.heroOutlookIcon.innerHTML = weatherIcon("clear");
    els.heroOutlookText.textContent = "تا یک هفته آینده بارشی پیش‌بینی نمی‌شود.";
    return;
  }

  const info = describeWeatherCode(rainyDay.weatherCode);
  const weekday = formatWeekday(rainyDay.date);
  const prob = rainyDay.precipitationProbability;
  const precipWord =
    info.category === "snow" ? "برف" : info.category === "rain" || info.category === "storm" ? "باران" : "بارش";

  els.heroOutlookIcon.innerHTML = weatherIcon(info.icon);
  els.heroOutlookText.textContent = `${weekday}: احتمال بارش ${precipWord} (${prob}٪)`;
}

function renderAqi(airQuality: AirQuality | null): void {
  if (!airQuality || airQuality.usAqi === null) {
    els.aqiCard.classList.add("aqi-card--hidden");
    return;
  }

  els.aqiCard.classList.remove("aqi-card--hidden");
  els.aqiCard.classList.remove(...AQI_CLASSES);

  const { label, className } = classifyAqi(airQuality.usAqi);
  els.aqiCard.classList.add(className);
  els.aqiCategory.textContent = label;
  els.aqiNumber.textContent = String(Math.round(airQuality.usAqi));
}

function renderTempSummaries(hourly: HourlyEntry[], daily: DailyEntry[]): void {
  if (hourly.length > 0) {
    const temps = hourly.map((h) => h.temperature);
    const hottestIdx = temps.indexOf(Math.max(...temps));
    const coldestIdx = temps.indexOf(Math.min(...temps));
    els.hourlyChartCaption.textContent =
      `گرم‌ترین ساعت: ${formatTime(hourly[hottestIdx].time)} (${Math.round(temps[hottestIdx])}°) ` +
      `· سردترین ساعت: ${formatTime(hourly[coldestIdx].time)} (${Math.round(temps[coldestIdx])}°)`;
  }

  if (daily.length > 0) {
    const maxTemps = daily.map((d) => d.temperatureMax);
    const minTemps = daily.map((d) => d.temperatureMin);
    const hottestDayIdx = maxTemps.indexOf(Math.max(...maxTemps));
    const coldestDayIdx = minTemps.indexOf(Math.min(...minTemps));
    els.dailyChartCaption.textContent =
      `گرم‌ترین روز: ${formatWeekday(daily[hottestDayIdx].date)} (${Math.round(maxTemps[hottestDayIdx])}°) ` +
      `· سردترین شب: ${formatWeekday(daily[coldestDayIdx].date)} (${Math.round(minTemps[coldestDayIdx])}°)`;
  }
}

function renderHero(data: WeatherResponse): void {
  const { current, location } = data;
  const info = describeWeatherCode(current.weatherCode);

  setHeroCategory(info.category);
  els.heroIcon.innerHTML = weatherIcon(info.icon);
  els.heroTemp.textContent = `${Math.round(current.temperature)}°`;
  els.heroCondition.textContent = info.label;

  const locationParts = [location.name, location.region, location.country].filter(Boolean);
  els.heroLocation.textContent = locationParts.join("، ");

  els.heroFeelsLike.textContent = `${Math.round(current.apparentTemperature)}°`;
  els.heroUpdated.textContent = formatTime(data.fetchedAt);

  els.heroTip.textContent = conditionTip({
    category: info.category,
    temperature: current.temperature,
    windSpeed: current.windSpeed,
  });

  els.heroMascot.innerHTML = mascotSvg(info.category);

  renderOutlook(data.daily);
  renderDayLength(data.daily);
}

/** Day length today vs. tomorrow — a small "getting longer/shorter" note using only sunrise/sunset already in hand. */
function renderDayLength(daily: DailyEntry[]): void {
  const today = daily[0];
  const tomorrow = daily[1];
  if (!today) {
    els.heroDaylength.textContent = "";
    return;
  }

  const lengthMinutes = (sunrise: string, sunset: string) =>
    Math.round((new Date(sunset).getTime() - new Date(sunrise).getTime()) / 60000);

  const todayLength = lengthMinutes(today.sunrise, today.sunset);
  const hours = Math.floor(todayLength / 60);
  const minutes = todayLength % 60;
  let text = `طول روز امروز: ${hours} ساعت و ${minutes} دقیقه`;

  if (tomorrow) {
    const tomorrowLength = lengthMinutes(tomorrow.sunrise, tomorrow.sunset);
    const diff = tomorrowLength - todayLength;
    if (diff > 0) text += ` (در حال بلندتر شدن، ${diff} دقیقه در روز)`;
    else if (diff < 0) text += ` (در حال کوتاه‌تر شدن، ${Math.abs(diff)} دقیقه در روز)`;
  }

  els.heroDaylength.textContent = text;
}

function renderClimateComparison(comparison: ClimateComparison | null): void {
  if (!comparison) {
    els.climateCard.classList.add("state-panel--hidden");
    return;
  }

  els.climateCard.classList.remove("state-panel--hidden");
  els.climateCard.classList.remove(...CLIMATE_CLASSES);

  const diff = comparison.diffFromAvgMax;
  if (Math.abs(diff) < 1) {
    els.climateCard.classList.add("climate-card--normal");
    els.climateText.textContent = `نزدیک به میانگین معمول (میانگین: ${comparison.avgMax}°)`;
  } else if (diff > 0) {
    els.climateCard.classList.add("climate-card--warmer");
    els.climateText.textContent = `${diff.toFixed(1)}° گرم‌تر از معمول (میانگین: ${comparison.avgMax}°)`;
  } else {
    els.climateCard.classList.add("climate-card--cooler");
    els.climateText.textContent = `${Math.abs(diff).toFixed(1)}° خنک‌تر از معمول (میانگین: ${comparison.avgMax}°)`;
  }
}

/** Simple comfort score across the week: mild temperature, low rain chance, low wind. */
function renderBestDay(daily: DailyEntry[]): void {
  if (daily.length === 0) {
    els.bestDayCallout.textContent = "";
    return;
  }

  let bestIndex = 0;
  let bestScore = -Infinity;

  daily.forEach((entry, i) => {
    const tempPenalty = Math.abs(entry.temperatureMax - BEST_DAY_IDEAL_TEMP);
    const score = -tempPenalty - entry.precipitationProbability * 0.3 - entry.windSpeedMax * 0.15;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  });

  const best = daily[bestIndex];
  els.bestDayCallout.textContent =
    `☀️ بهترین روز این هفته برای بیرون رفتن: ${formatWeekday(best.date)} ` +
    `(${Math.round(best.temperatureMax)}°، احتمال بارش ${best.precipitationProbability}٪)`;
}

function renderDetails(data: WeatherResponse): void {
  const { current, daily } = data;
  const today = daily[0];

  els.detailHumidity.textContent = `${current.humidity}٪`;
  els.detailWind.textContent = `${Math.round(current.windSpeed)} کیلومتر/ساعت`;
  els.detailWindDirection.textContent = windDirectionLabel(current.windDirection);
  els.detailWindCompass.innerHTML = windCompassSvg(current.windDirection);
  els.detailPressure.textContent = `${Math.round(current.pressure)} هکتوپاسکال`;
  els.detailUv.textContent = current.uvIndex.toFixed(1);
  els.detailVisibility.textContent = current.visibility
    ? `${Math.round(current.visibility / 1000)} کیلومتر`
    : "نامشخص";

  if (today) {
    els.detailSunrise.textContent = formatTime(today.sunrise);
    els.detailSunset.textContent = formatTime(today.sunset);
  }
}

function renderWeeklyPrecip(daily: DailyEntry[]): void {
  if (daily.length === 0) {
    els.weeklyPrecip.textContent = "";
    return;
  }
  const total = daily.reduce((sum, d) => sum + d.precipitationSum, 0);
  if (total < 0.1) {
    els.weeklyPrecip.textContent = "🌤 بارشی برای این هفته پیش‌بینی نمی‌شود.";
    return;
  }
  els.weeklyPrecip.textContent = `🌧 بارش تخمینی این هفته: ${total.toFixed(1)} میلی‌متر`;
}

/** First/last hour today with meaningful precipitation, from the hourly forecast already on hand. */
function renderTodayRainWindow(hourly: HourlyEntry[], daily: DailyEntry[]): void {
  const todayDate = daily[0]?.date;
  if (!todayDate) {
    els.todayRainWindow.textContent = "";
    return;
  }

  const todayHours = hourly.filter((h) => h.time.startsWith(todayDate));
  const rainingHours = todayHours.filter(
    (h) => h.precipitation > 0.1 || h.precipitationProbability >= RAIN_WINDOW_MIN_PROBABILITY
  );

  if (rainingHours.length === 0) {
    els.todayRainWindow.textContent = "";
    return;
  }

  const start = formatTime(rainingHours[0].time);
  const end = formatTime(rainingHours[rainingHours.length - 1].time);
  els.todayRainWindow.textContent =
    start === end
      ? `☔ بارش امروز حدود ساعت ${start} پیش‌بینی می‌شود.`
      : `☔ بارش امروز حدود از ساعت ${start} تا ${end} پیش‌بینی می‌شود.`;
}

function renderHourly(hourly: HourlyEntry[]): void {
  els.hourlyList.innerHTML = "";
  if (hourly.length === 0) return;

  const temps = hourly.map((h) => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  for (const entry of hourly) {
    const info = describeWeatherCode(entry.weatherCode);
    const barColor = heatColor(entry.temperature, minTemp, maxTemp);
    const li = document.createElement("li");
    li.className = `hour-row hour-row--${info.category}`;
    li.innerHTML = `
      <span class="heat-bar" style="background:${barColor}" aria-hidden="true"></span>
      <span class="hour-row__time">${formatTime(entry.time)}</span>
      <span class="hour-row__icon">${weatherIcon(info.icon)}</span>
      <span class="hour-row__condition">${info.label} · ${entry.precipitationProbability}٪ بارش</span>
      <span class="hour-row__temp">${Math.round(entry.temperature)}°</span>
    `;
    els.hourlyList.appendChild(li);
  }
}

function renderDaily(daily: DailyEntry[]): void {
  els.dailyList.innerHTML = "";
  if (daily.length === 0) return;

  const maxTemps = daily.map((d) => d.temperatureMax);
  const weekMin = Math.min(...maxTemps);
  const weekMax = Math.max(...maxTemps);

  for (const entry of daily) {
    const info = describeWeatherCode(entry.weatherCode);
    const isWindy = entry.windSpeedMax >= WINDY_THRESHOLD_KMH;
    const isFrost = entry.temperatureMin < FROST_THRESHOLD_C;
    const barColor = heatColor(entry.temperatureMax, weekMin, weekMax);

    const li = document.createElement("li");
    li.className = `daily-row daily-row--${info.category}`;
    li.innerHTML = `
      <span class="heat-bar" style="background:${barColor}" aria-hidden="true"></span>
      <span class="daily-row__day">${formatWeekday(entry.date)}</span>
      <span class="daily-row__icon">${weatherIcon(info.icon)}</span>
      <span class="daily-row__condition">
        ${info.label} · ${entry.precipitationProbability}٪ بارش
        ${
          isWindy
            ? `<span class="wind-badge" title="باد نسبتاً شدید">${windBadgeSvg()}<span>باد شدید</span></span>`
            : ""
        }
        ${isFrost ? `<span class="frost-badge" title="احتمال یخبندان">❄️<span>یخبندان</span></span>` : ""}
      </span>
      <span class="daily-row__temps">
        <span class="daily-row__temp-max">${Math.round(entry.temperatureMax)}°</span>
        <span class="daily-row__temp-min">${Math.round(entry.temperatureMin)}°</span>
      </span>
    `;
    els.dailyList.appendChild(li);
  }
}

function renderWeather(data: WeatherResponse): void {
  renderHero(data);
  renderAqi(data.airQuality);
  renderClimateComparison(data.climateComparison);
  renderDetails(data);
  renderHourly(data.hourly);
  renderDaily(data.daily);
  renderTempSummaries(data.hourly, data.daily);
  renderBestDay(data.daily);
  renderWeeklyPrecip(data.daily);
  renderTodayRainWindow(data.hourly, data.daily);
  showState("content");
}

function setActiveCityCard(city: string): void {
  const cards = els.quickCities.querySelectorAll<HTMLButtonElement>(".city-card");
  cards.forEach((card) => {
    card.setAttribute("aria-pressed", String(card.dataset.city === city));
  });
}

async function runWeatherFetch(url: string, activeCityForCards: string): Promise<void> {
  showState("loading");
  els.status.textContent = "در حال جست‌وجو…";
  setActiveCityCard(activeCityForCards);

  try {
    const response = await fetch(url);
    const body = await response.json();

    if (!response.ok) {
      const errorBody = body as ApiErrorBody;
      throw new Error(errorBody.message || "خطای ناشناخته رخ داد.");
    }

    renderWeather(body as WeatherResponse);
    els.status.textContent = `اطلاعات آب‌وهوای ${(body as WeatherResponse).location.name} نمایش داده شد.`;
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطای ناشناخته رخ داد.";
    els.errorMessage.textContent = message;
    showState("error");
    els.status.textContent = message;
  }
}

function fetchWeather(city: string): Promise<void> {
  return runWeatherFetch(`/api/weather?city=${encodeURIComponent(city)}`, city);
}

function fetchWeatherByLocation(loc: GeocodeSuggestion): Promise<void> {
  const params = new URLSearchParams({
    lat: String(loc.latitude),
    lon: String(loc.longitude),
    name: loc.name,
    country: loc.country,
    timezone: loc.timezone,
  });
  if (loc.admin1) params.set("region", loc.admin1);
  return runWeatherFetch(`/api/weather?${params.toString()}`, loc.name);
}

function renderQuickCities(): void {
  els.quickCities.innerHTML = "";
  for (const city of CITIES) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-card";
    button.dataset.city = city.name;
    button.setAttribute("aria-pressed", String(city.name === DEFAULT_CITY));
    button.innerHTML = `
      <span class="city-card__icon">${cityIconSvg(city.icon)}</span>
      <span class="city-card__name">${city.name}</span>
    `;
    els.quickCities.appendChild(button);
  }
}

function renderHeatmap(cities: CityExtreme[]): void {
  if (cities.length === 0) return;

  const temps = cities.map((c) => c.temperature);
  const min = Math.min(...temps);
  const max = Math.max(...temps);

  els.heatmap.innerHTML = cities
    .map((city) => {
      const color = heatColor(city.temperature, min, max);
      return `
        <div class="heatmap__cell" style="background:${color}">
          <span class="heatmap__cell-name">${city.name}</span>
          <span class="heatmap__cell-temp">${Math.round(city.temperature)}°</span>
        </div>`;
    })
    .join("");

  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
  let rainCount = 0;
  let snowCount = 0;
  for (const city of cities) {
    const category = describeWeatherCode(city.weatherCode).category;
    if (category === "rain" || category === "storm") rainCount++;
    else if (category === "snow") snowCount++;
  }

  const parts = [`میانگین دمای ${cities.length} استان کشور: ${avgTemp.toFixed(1)}°`];
  if (rainCount > 0) parts.push(`${rainCount} استان بارش باران دارند`);
  if (snowCount > 0) parts.push(`${snowCount} استان بارش برف دارند`);
  if (rainCount === 0 && snowCount === 0) parts.push("در حال حاضر بارشی در کشور گزارش نشده است");

  els.heatmapAnalysis.textContent = parts.join(" · ");
}

async function loadHighlights(): Promise<void> {
  try {
    const response = await fetch("/api/highlights");
    if (!response.ok) return;
    const data = (await response.json()) as HighlightsResponse;

    if (data.hottest) {
      els.extremeHotCity.textContent = data.hottest.name;
      els.extremeHotTemp.textContent = `${Math.round(data.hottest.temperature)}°`;
    }
    if (data.coldest) {
      els.extremeColdCity.textContent = data.coldest.name;
      els.extremeColdTemp.textContent = `${Math.round(data.coldest.temperature)}°`;
    }
    if (data.cities?.length > 0) {
      renderHeatmap(data.cities);
    }
    if (data.hottest || data.coldest) {
      els.extremes.classList.remove("state-panel--hidden");
    }
  } catch {
    // Non-critical section; fail silently and leave it hidden.
  }
}

/* ---------- Autocomplete ---------- */

let suggestionsDebounceTimer: number | undefined;
let currentSuggestions: GeocodeSuggestion[] = [];
let activeSuggestionIndex = -1;

function closeSuggestions(): void {
  els.suggestions.classList.remove("search__suggestions--open");
  els.suggestions.innerHTML = "";
  currentSuggestions = [];
  activeSuggestionIndex = -1;
  els.input.setAttribute("aria-expanded", "false");
}

function updateActiveSuggestion(optionEls: HTMLLIElement[]): void {
  optionEls.forEach((el, i) => el.classList.toggle("search__suggestion--active", i === activeSuggestionIndex));
}

function renderSuggestions(items: GeocodeSuggestion[]): void {
  currentSuggestions = items;
  activeSuggestionIndex = -1;

  if (items.length === 0) {
    closeSuggestions();
    return;
  }

  els.suggestions.innerHTML = items
    .map(
      (item, i) => `
      <li class="search__suggestion" role="option" data-index="${i}">
        <span>${item.name}</span>
        <span class="search__suggestion-region">${[item.admin1, item.country].filter(Boolean).join("، ")}</span>
      </li>`
    )
    .join("");
  els.suggestions.classList.add("search__suggestions--open");
  els.input.setAttribute("aria-expanded", "true");
}

async function fetchSuggestions(query: string): Promise<void> {
  if (query.trim().length < SUGGESTIONS_MIN_LENGTH) {
    closeSuggestions();
    return;
  }

  try {
    const response = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
    if (!response.ok) return;
    const items = (await response.json()) as GeocodeSuggestion[];
    renderSuggestions(items);
  } catch {
    // Non-critical; leave the dropdown as-is.
  }
}

function selectSuggestion(item: GeocodeSuggestion): void {
  els.input.value = item.name;
  closeSuggestions();
  fetchWeatherByLocation(item);
}

els.input.addEventListener("input", () => {
  window.clearTimeout(suggestionsDebounceTimer);
  const value = els.input.value;
  suggestionsDebounceTimer = window.setTimeout(() => fetchSuggestions(value), SUGGESTIONS_DEBOUNCE_MS);
});

els.input.addEventListener("keydown", (event) => {
  if (!els.suggestions.classList.contains("search__suggestions--open")) return;
  const optionEls = Array.from(els.suggestions.querySelectorAll<HTMLLIElement>(".search__suggestion"));

  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, optionEls.length - 1);
    updateActiveSuggestion(optionEls);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
    updateActiveSuggestion(optionEls);
  } else if (event.key === "Enter") {
    if (activeSuggestionIndex >= 0 && currentSuggestions[activeSuggestionIndex]) {
      event.preventDefault();
      selectSuggestion(currentSuggestions[activeSuggestionIndex]);
    }
  } else if (event.key === "Escape") {
    closeSuggestions();
  }
});

els.suggestions.addEventListener("click", (event) => {
  const li = (event.target as HTMLElement).closest<HTMLLIElement>(".search__suggestion");
  if (!li) return;
  const index = Number(li.dataset.index);
  const item = currentSuggestions[index];
  if (item) selectSuggestion(item);
});

document.addEventListener("click", (event) => {
  if (!els.searchField.contains(event.target as Node)) {
    closeSuggestions();
  }
});

/* ---------- Wiring ---------- */

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  closeSuggestions();
  const value = els.input.value.trim();
  if (!value) {
    els.status.textContent = "لطفاً نام یک شهر را وارد کنید.";
    return;
  }
  fetchWeather(value);
});

els.themeToggle.addEventListener("click", toggleTheme);

els.quickCities.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement).closest<HTMLButtonElement>(".city-card");
  if (!target?.dataset.city) return;
  els.input.value = target.dataset.city;
  fetchWeather(target.dataset.city);
});

els.quickCitiesToggle.addEventListener("click", () => {
  const collapsed = els.quickCities.classList.toggle("quick-cities__grid--collapsed");
  els.quickCitiesToggle.setAttribute("aria-expanded", String(!collapsed));
  els.quickCitiesToggle.textContent = collapsed ? "نمایش همه شهرها" : "نمایش کمتر";
});

/* ---------- Init ---------- */

initTheme();
renderQuickCities();
els.input.value = DEFAULT_CITY;
fetchWeather(DEFAULT_CITY);
loadHighlights();
