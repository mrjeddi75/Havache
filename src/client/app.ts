import { describeWeatherCode, windDirectionLabel, conditionTip, type Category } from "./weatherCodes.js";
import { weatherIcon, windBadgeSvg } from "./icons.js";
import { cityIconSvg } from "./cityIcons.js";
import { CITIES } from "../shared/cities.js";
import { initTheme, toggleTheme } from "./theme.js";
import { classifyAqi } from "./aqi.js";
import { buildLineChart } from "./chart.js";

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
  isDay: boolean;
}

interface DailyEntry {
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

interface AirQuality {
  usAqi: number | null;
  pm2_5: number | null;
  pm10: number | null;
  category: string;
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
  updatedAt: string;
}

const DEFAULT_CITY = "تبریز";
const WINDY_THRESHOLD_KMH = 35;
const OUTLOOK_DAY_OFFSET = 4; // "~4 days from now"
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
  heroOutlookIcon: document.getElementById("hero-outlook-icon") as HTMLElement,
  heroOutlookText: document.getElementById("hero-outlook-text") as HTMLElement,

  aqiCard: document.getElementById("aqi-card") as HTMLElement,
  aqiCategory: document.getElementById("aqi-category") as HTMLElement,
  aqiNumber: document.getElementById("aqi-number") as HTMLElement,

  detailHumidity: document.getElementById("detail-humidity") as HTMLElement,
  detailWind: document.getElementById("detail-wind") as HTMLElement,
  detailWindDirection: document.getElementById("detail-wind-direction") as HTMLElement,
  detailPressure: document.getElementById("detail-pressure") as HTMLElement,
  detailUv: document.getElementById("detail-uv") as HTMLElement,
  detailVisibility: document.getElementById("detail-visibility") as HTMLElement,
  detailSunrise: document.getElementById("detail-sunrise") as HTMLElement,
  detailSunset: document.getElementById("detail-sunset") as HTMLElement,

  hourlyRail: document.getElementById("hourly-rail") as HTMLElement,
  hourlyChart: document.getElementById("hourly-chart") as HTMLElement,
  scrollLeft: document.getElementById("hourly-scroll-left") as HTMLButtonElement,
  scrollRight: document.getElementById("hourly-scroll-right") as HTMLButtonElement,

  dailyList: document.getElementById("daily-list") as HTMLUListElement,
  dailyChart: document.getElementById("daily-chart") as HTMLElement,

  extremes: document.getElementById("extremes") as HTMLElement,
  extremeHotCity: document.getElementById("extreme-hot-city") as HTMLElement,
  extremeHotTemp: document.getElementById("extreme-hot-temp") as HTMLElement,
  extremeColdCity: document.getElementById("extreme-cold-city") as HTMLElement,
  extremeColdTemp: document.getElementById("extreme-cold-temp") as HTMLElement,
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
  const entry = daily[OUTLOOK_DAY_OFFSET];
  if (!entry) {
    els.heroOutlookText.textContent = "";
    return;
  }

  const info = describeWeatherCode(entry.weatherCode);
  const weekday = formatWeekday(entry.date);
  const prob = entry.precipitationProbability;

  if (prob < OUTLOOK_MIN_PROBABILITY) {
    els.heroOutlookIcon.innerHTML = weatherIcon("clear");
    els.heroOutlookText.textContent = `در ${weekday} (۴ روز دیگر) بارشی پیش‌بینی نمی‌شود.`;
    return;
  }

  const precipWord =
    info.category === "snow" ? "برف" : info.category === "rain" || info.category === "storm" ? "باران" : "بارش";

  els.heroOutlookIcon.innerHTML = weatherIcon(info.icon);
  els.heroOutlookText.textContent = `احتمال ${precipWord} در ${weekday} (۴ روز دیگر): ${prob}٪`;
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

function renderCharts(hourly: HourlyEntry[], daily: DailyEntry[]): void {
  if (hourly.length > 0) {
    const hourlyLabels = hourly.map((h) => formatTime(h.time));
    els.hourlyChart.innerHTML = buildLineChart(
      [{ values: hourly.map((h) => h.temperature), colorVar: "--color-primary" }],
      hourlyLabels
    );
  }

  if (daily.length > 0) {
    const dailyLabels = daily.map((d) => formatWeekday(d.date));
    els.dailyChart.innerHTML = buildLineChart(
      [
        { values: daily.map((d) => d.temperatureMax), colorVar: "--color-accent" },
        { values: daily.map((d) => d.temperatureMin), colorVar: "--color-primary" },
      ],
      dailyLabels
    );
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
    uvIndex: current.uvIndex,
    windSpeed: current.windSpeed,
  });

  renderOutlook(data.daily);
}

function renderDetails(data: WeatherResponse): void {
  const { current, daily } = data;
  const today = daily[0];

  els.detailHumidity.textContent = `${current.humidity}٪`;
  els.detailWind.textContent = `${Math.round(current.windSpeed)} کیلومتر/ساعت`;
  els.detailWindDirection.textContent = windDirectionLabel(current.windDirection);
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

function renderHourly(hourly: HourlyEntry[]): void {
  els.hourlyRail.innerHTML = "";

  for (const entry of hourly) {
    const info = describeWeatherCode(entry.weatherCode);
    const card = document.createElement("div");
    card.className = `hour-card hour-card--${info.category}`;
    card.innerHTML = `
      <span class="hour-card__time">${formatTime(entry.time)}</span>
      <span class="hour-card__icon">${weatherIcon(info.icon)}</span>
      <span class="hour-card__temp">${Math.round(entry.temperature)}°</span>
      <span class="hour-card__precip">${entry.precipitationProbability}٪ بارش</span>
    `;
    els.hourlyRail.appendChild(card);
  }
}

function renderDaily(daily: DailyEntry[]): void {
  els.dailyList.innerHTML = "";

  for (const entry of daily) {
    const info = describeWeatherCode(entry.weatherCode);
    const isWindy = entry.windSpeedMax >= WINDY_THRESHOLD_KMH;

    const li = document.createElement("li");
    li.className = `daily-row daily-row--${info.category}`;
    li.innerHTML = `
      <span class="daily-row__day">${formatWeekday(entry.date)}</span>
      <span class="daily-row__icon">${weatherIcon(info.icon)}</span>
      <span class="daily-row__condition">
        ${info.label} · ${entry.precipitationProbability}٪ بارش
        ${
          isWindy
            ? `<span class="wind-badge" title="باد نسبتاً شدید">${windBadgeSvg()}<span>باد شدید</span></span>`
            : ""
        }
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
  renderDetails(data);
  renderHourly(data.hourly);
  renderDaily(data.daily);
  renderCharts(data.hourly, data.daily);
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

els.scrollRight.addEventListener("click", () => {
  els.hourlyRail.scrollBy({ left: -240, behavior: "smooth" });
});

els.scrollLeft.addEventListener("click", () => {
  els.hourlyRail.scrollBy({ left: 240, behavior: "smooth" });
});

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
