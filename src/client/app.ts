import { describeWeatherCode, windDirectionLabel, conditionTip, type Category } from "./weatherCodes.js";
import { weatherIcon, windBadgeSvg } from "./icons.js";

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
  fetchedAt: string;
}

interface ApiErrorBody {
  error: string;
  message: string;
}

const DEBOUNCE_MS = 300;
const DEFAULT_CITY = "تبریز";
const WINDY_THRESHOLD_KMH = 35;

const els = {
  form: document.getElementById("search-form") as HTMLFormElement,
  input: document.getElementById("city-input") as HTMLInputElement,
  status: document.getElementById("search-status") as HTMLParagraphElement,

  quickCities: document.getElementById("quick-cities") as HTMLElement,

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

  detailHumidity: document.getElementById("detail-humidity") as HTMLElement,
  detailWind: document.getElementById("detail-wind") as HTMLElement,
  detailWindDirection: document.getElementById("detail-wind-direction") as HTMLElement,
  detailPressure: document.getElementById("detail-pressure") as HTMLElement,
  detailUv: document.getElementById("detail-uv") as HTMLElement,
  detailVisibility: document.getElementById("detail-visibility") as HTMLElement,
  detailSunrise: document.getElementById("detail-sunrise") as HTMLElement,
  detailSunset: document.getElementById("detail-sunset") as HTMLElement,

  hourlyRail: document.getElementById("hourly-rail") as HTMLElement,
  scrollLeft: document.getElementById("hourly-scroll-left") as HTMLButtonElement,
  scrollRight: document.getElementById("hourly-scroll-right") as HTMLButtonElement,

  dailyList: document.getElementById("daily-list") as HTMLUListElement,
};

let debounceTimer: number | undefined;

const HERO_CATEGORY_CLASSES = ["hero--sunny", "hero--cloudy", "hero--fog", "hero--rain", "hero--snow", "hero--storm"];
const ROW_CATEGORY_CLASSES = [
  "daily-row--sunny",
  "daily-row--cloudy",
  "daily-row--fog",
  "daily-row--rain",
  "daily-row--snow",
  "daily-row--storm",
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
  renderDetails(data);
  renderHourly(data.hourly);
  renderDaily(data.daily);
  showState("content");
}

function setActiveCityCard(city: string): void {
  const cards = els.quickCities.querySelectorAll<HTMLButtonElement>(".city-card");
  cards.forEach((card) => {
    card.setAttribute("aria-pressed", String(card.dataset.city === city));
  });
}

async function fetchWeather(city: string): Promise<void> {
  showState("loading");
  els.status.textContent = "در حال جست‌وجو…";
  setActiveCityCard(city);

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
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

function handleInputDebounced(): void {
  window.clearTimeout(debounceTimer);
  const value = els.input.value.trim();
  if (!value) return;

  debounceTimer = window.setTimeout(() => {
    fetchWeather(value);
  }, DEBOUNCE_MS);
}

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  window.clearTimeout(debounceTimer);
  const value = els.input.value.trim();
  if (!value) {
    els.status.textContent = "لطفاً نام یک شهر را وارد کنید.";
    return;
  }
  fetchWeather(value);
});

els.input.addEventListener("input", handleInputDebounced);

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

// Load a sensible default so the page never opens empty.
els.input.value = DEFAULT_CITY;
fetchWeather(DEFAULT_CITY);
