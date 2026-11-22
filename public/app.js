// src/client/weatherCodes.ts
var WEATHER_CODE_MAP = {
  0: { label: "\u0635\u0627\u0641", icon: "clear", category: "sunny" },
  1: { label: "\u0639\u0645\u062F\u062A\u0627\u064B \u0635\u0627\u0641", icon: "partly-cloudy", category: "sunny" },
  2: { label: "\u0646\u06CC\u0645\u0647\u200C\u0627\u0628\u0631\u06CC", icon: "partly-cloudy", category: "cloudy" },
  3: { label: "\u0627\u0628\u0631\u06CC", icon: "cloudy", category: "cloudy" },
  45: { label: "\u0645\u0647", icon: "fog", category: "fog" },
  48: { label: "\u0645\u0647 \u06CC\u062E\u200C\u0632\u062F\u0647", icon: "fog", category: "fog" },
  51: { label: "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u0633\u0628\u06A9", icon: "drizzle", category: "rain" },
  53: { label: "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u0645\u062A\u0648\u0633\u0637", icon: "drizzle", category: "rain" },
  55: { label: "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u0634\u062F\u06CC\u062F", icon: "drizzle", category: "rain" },
  56: { label: "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u06CC\u062E\u200C\u0632\u062F\u0647 \u0633\u0628\u06A9", icon: "drizzle", category: "rain" },
  57: { label: "\u0646\u0645\u200C\u0646\u0645 \u0628\u0627\u0631\u0627\u0646 \u06CC\u062E\u200C\u0632\u062F\u0647 \u0634\u062F\u06CC\u062F", icon: "drizzle", category: "rain" },
  61: { label: "\u0628\u0627\u0631\u0627\u0646 \u0633\u0628\u06A9", icon: "rain", category: "rain" },
  63: { label: "\u0628\u0627\u0631\u0627\u0646 \u0645\u062A\u0648\u0633\u0637", icon: "rain", category: "rain" },
  65: { label: "\u0628\u0627\u0631\u0627\u0646 \u0634\u062F\u06CC\u062F", icon: "rain", category: "rain" },
  66: { label: "\u0628\u0627\u0631\u0627\u0646 \u06CC\u062E\u200C\u0632\u062F\u0647 \u0633\u0628\u06A9", icon: "rain", category: "rain" },
  67: { label: "\u0628\u0627\u0631\u0627\u0646 \u06CC\u062E\u200C\u0632\u062F\u0647 \u0634\u062F\u06CC\u062F", icon: "rain", category: "rain" },
  71: { label: "\u0628\u0631\u0641 \u0633\u0628\u06A9", icon: "snow", category: "snow" },
  73: { label: "\u0628\u0631\u0641 \u0645\u062A\u0648\u0633\u0637", icon: "snow", category: "snow" },
  75: { label: "\u0628\u0631\u0641 \u0634\u062F\u06CC\u062F", icon: "snow", category: "snow" },
  77: { label: "\u062F\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u0628\u0631\u0641", icon: "snow", category: "snow" },
  80: { label: "\u0631\u06AF\u0628\u0627\u0631 \u0633\u0628\u06A9", icon: "showers", category: "rain" },
  81: { label: "\u0631\u06AF\u0628\u0627\u0631 \u0645\u062A\u0648\u0633\u0637", icon: "showers", category: "rain" },
  82: { label: "\u0631\u06AF\u0628\u0627\u0631 \u0634\u062F\u06CC\u062F", icon: "showers", category: "rain" },
  85: { label: "\u0631\u06AF\u0628\u0627\u0631 \u0628\u0631\u0641 \u0633\u0628\u06A9", icon: "snow", category: "snow" },
  86: { label: "\u0631\u06AF\u0628\u0627\u0631 \u0628\u0631\u0641 \u0634\u062F\u06CC\u062F", icon: "snow", category: "snow" },
  95: { label: "\u0631\u0639\u062F\u0648\u0628\u0631\u0642", icon: "thunderstorm", category: "storm" },
  96: { label: "\u0631\u0639\u062F\u0648\u0628\u0631\u0642 \u0628\u0627 \u062A\u06AF\u0631\u06AF \u0633\u0628\u06A9", icon: "thunderstorm", category: "storm" },
  99: { label: "\u0631\u0639\u062F\u0648\u0628\u0631\u0642 \u0628\u0627 \u062A\u06AF\u0631\u06AF \u0634\u062F\u06CC\u062F", icon: "thunderstorm", category: "storm" }
};
function describeWeatherCode(code) {
  return WEATHER_CODE_MAP[code] ?? { label: "\u0646\u0627\u0645\u0634\u062E\u0635", icon: "cloudy", category: "cloudy" };
}
function windDirectionLabel(deg) {
  const directions = [
    "\u0634\u0645\u0627\u0644",
    "\u0634\u0645\u0627\u0644\u200C\u0634\u0631\u0642",
    "\u0634\u0631\u0642",
    "\u062C\u0646\u0648\u0628\u200C\u0634\u0631\u0642",
    "\u062C\u0646\u0648\u0628",
    "\u062C\u0646\u0648\u0628\u200C\u063A\u0631\u0628",
    "\u063A\u0631\u0628",
    "\u0634\u0645\u0627\u0644\u200C\u063A\u0631\u0628"
  ];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}
function conditionTip(params) {
  const { category, temperature, windSpeed } = params;
  if (category === "storm") return "\u0628\u0647\u062A\u0631 \u0627\u0633\u062A \u0627\u06CC\u0646 \u0633\u0627\u0639\u062A\u200C\u0647\u0627 \u0628\u06CC\u0631\u0648\u0646 \u0627\u0632 \u062E\u0627\u0646\u0647 \u0646\u0645\u0627\u0646\u06CC\u062F.";
  if (category === "snow") return "\u0627\u0632 \u0628\u0627\u0631\u0634 \u0628\u0631\u0641 \u0644\u0630\u062A \u0628\u0628\u0631!";
  if (category === "rain") return "\u0627\u0645\u0631\u0648\u0632 \u0628\u0627\u0631\u0648\u0646 \u0645\u06CC\u200C\u0628\u0627\u0631\u0647\u060C \u0686\u062A\u0631 \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634.";
  if (category === "fog") return "\u062F\u06CC\u062F \u06A9\u0645 \u0627\u0633\u062A\u060C \u062F\u0631 \u0631\u0627\u0646\u0646\u062F\u06AF\u06CC \u0627\u062D\u062A\u06CC\u0627\u0637 \u06A9\u0646\u06CC\u062F.";
  if (windSpeed >= 40) return "\u0628\u0627\u062F \u0646\u0633\u0628\u062A\u0627\u064B \u0634\u062F\u06CC\u062F \u0627\u0633\u062A\u060C \u0645\u0631\u0627\u0642\u0628 \u0627\u0634\u06CC\u0627\u06CC \u0633\u0628\u06A9 \u0628\u0627\u0634\u06CC\u062F.";
  if (temperature > 40) return "\u062E\u06CC\u0644\u06CC \u06AF\u0631\u0645\u0647\u060C \u0645\u0631\u0627\u0642\u0628 \u062E\u0648\u062F\u062A \u0628\u0627\u0634.";
  if (temperature > 30) return "\u062A\u0627\u0628\u0634 \u0622\u0641\u062A\u0627\u0628 \u0634\u062F\u06CC\u062F \u0627\u0633\u062A\u060C \u0627\u0632 \u06A9\u0631\u0645 \u0636\u062F\u0622\u0641\u062A\u0627\u0628 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u06A9\u0646\u06CC\u062F.";
  if (temperature < 20) return "\u0645\u0631\u0627\u0642\u0628 \u0628\u0627\u0634 \u0633\u0631\u0645\u0627 \u0646\u062E\u0648\u0631\u06CC.";
  return "\u0647\u0648\u0627 \u062E\u0648\u0628\u0647\u060C \u0644\u0630\u062A \u0628\u0628\u0631\u06CC\u062F.";
}

// src/client/icons.ts
var ICONS = {
  clear: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="24" cy="24" r="9" fill="currentColor"/>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M24 4v5"/>
    </g>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation-delay:.15s">
      <path d="M24 39v5"/>
    </g>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation-delay:.3s">
      <path d="M44 24h-5"/>
    </g>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation-delay:.45s">
      <path d="M9 24H4"/>
    </g>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation-delay:.6s">
      <path d="M37.6 10.4l-3.5 3.5"/>
    </g>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation-delay:.75s">
      <path d="M13.9 34.1l-3.5 3.5"/>
    </g>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation-delay:.9s">
      <path d="M37.6 37.6l-3.5-3.5"/>
    </g>
    <g class="ray" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="animation-delay:1.05s">
      <path d="M13.9 13.9l-3.5-3.5"/>
    </g>
  </svg>`,
  "partly-cloudy": `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="17" cy="17" r="7" fill="currentColor" opacity="0.9"/>
    <g class="ray" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.8">
      <path d="M17 4v3M30 17h3M6 17h3M26.4 7.6l-2 2M9.6 24.4l-2 2"/>
    </g>
    <path class="cloud-shape" d="M14 37a8 8 0 0 1 1.2-15.9A10 10 0 0 1 34.8 24H35a7 7 0 0 1 0 14H14z" fill="currentColor"/>
  </svg>`,
  cloudy: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cloud-shape" d="M13 37a9 9 0 0 1 1.4-17.9A11.5 11.5 0 0 1 36.9 23H37a7.5 7.5 0 0 1 0 15H13z" fill="currentColor"/>
    <path class="cloud-shape cloud-shape--back" d="M6 30a6 6 0 0 1 1-11.9A7.6 7.6 0 0 1 21 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  </svg>`,
  fog: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cloud-shape" d="M15 21a9 9 0 0 1 1.4-13.9A11.5 11.5 0 0 1 38.9 11H39a7.5 7.5 0 0 1 0 15" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path class="fog-line" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M8 30h32"/>
    <path class="fog-line" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M8 36h32" style="animation-delay:.3s"/>
    <path class="fog-line" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M8 42h32" style="animation-delay:.6s"/>
  </svg>`,
  drizzle: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cloud-shape" d="M13 26a9 9 0 0 1 1.4-15.9A11.5 11.5 0 0 1 36.9 13H37a7.5 7.5 0 0 1 0 15H13z" fill="currentColor"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M17 37v3"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M25 37v3" style="animation-delay:.25s"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M33 37v3" style="animation-delay:.5s"/>
  </svg>`,
  rain: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cloud-shape" d="M13 24a9 9 0 0 1 1.4-15.9A11.5 11.5 0 0 1 36.9 11H37a7.5 7.5 0 0 1 0 15H13z" fill="currentColor"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M16 35l-2 6"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M25 35l-2 6" style="animation-delay:.2s"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M34 35l-2 6" style="animation-delay:.4s"/>
  </svg>`,
  snow: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cloud-shape" d="M13 24a9 9 0 0 1 1.4-15.9A11.5 11.5 0 0 1 36.9 11H37a7.5 7.5 0 0 1 0 15H13z" fill="currentColor"/>
    <g class="flake" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
      <path d="M17 35v7M13.5 38.5h7"/>
    </g>
    <g class="flake" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="animation-delay:.3s">
      <path d="M26 35v7M22.5 38.5h7"/>
    </g>
    <g class="flake" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" style="animation-delay:.6s">
      <path d="M35 35v7M31.5 38.5h7"/>
    </g>
  </svg>`,
  showers: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cloud-shape" d="M13 22a9 9 0 0 1 1.4-15.9A11.5 11.5 0 0 1 36.9 9H37a7.5 7.5 0 0 1 0 15H13z" fill="currentColor"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M15 32l-3 8"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M24 32l-3 8" style="animation-delay:.15s"/>
    <path class="drop" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M33 32l-3 8" style="animation-delay:.3s"/>
  </svg>`,
  thunderstorm: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path class="cloud-shape" d="M13 22a9 9 0 0 1 1.4-15.9A11.5 11.5 0 0 1 36.9 9H37a7.5 7.5 0 0 1 0 15H13z" fill="currentColor"/>
    <path class="bolt" d="M25 27l-6 10h5l-3 8 9-12h-5l3-6h-3z" fill="currentColor" stroke="currentColor" stroke-linejoin="round"/>
  </svg>`
};
function weatherIconSvg(key) {
  return ICONS[key] ?? ICONS.cloudy;
}
function weatherIcon(key) {
  return `<span class="weather-icon weather-icon--${key}">${weatherIconSvg(key)}</span>`;
}
function windBadgeSvg() {
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g class="wind-line" stroke="currentColor" stroke-width="3" stroke-linecap="round">
      <path d="M6 16h24a5 5 0 1 0-4-8"/>
    </g>
    <g class="wind-line" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="animation-delay:.2s">
      <path d="M4 26h30a5 5 0 1 1-4 8"/>
    </g>
    <g class="wind-line" stroke="currentColor" stroke-width="3" stroke-linecap="round" style="animation-delay:.4s">
      <path d="M8 36h20"/>
    </g>
  </svg>`;
}

// src/client/cityIcons.ts
var PIN_OUTLINE = `M24 4C15.2 4 8 11.2 8 20c0 12 16 24 16 24s16-12 16-24C40 11.2 32.8 4 24 4z`;
var INNER_MARKS = {
  // Capital: a small five-point star (seat of government)
  capital: `<path d="M24 12l2.1 4.4 4.9.7-3.5 3.4.8 4.9-4.3-2.3-4.3 2.3.8-4.9-3.5-3.4 4.9-.7L24 12z" fill="#fff"/>`,
  // Landmark: a domed arch (shrine / historic monument silhouette)
  landmark: `<path d="M15 22h18v2H15v-2zm2-2c0-4 3-7 7-7s7 3 7 7h-4c0-1.7-1.3-3-3-3s-3 1.3-3 3h-4z" fill="#fff"/>`,
  // Mountain: twin peaks
  mountain: `<path d="M13 22l5-7 3.5 4.2L25 13l6 9H13z" fill="#fff"/>`,
  // Coastal: rolling wave lines (river/sea/green lowland)
  coastal: `<path d="M13 17c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M13 22c1.5 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 3-1.4 4.5 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  // Desert: sun over a dune
  desert: `<circle cx="24" cy="15" r="3.2" fill="#fff"/><path d="M12 23c3-3 8-3 11 0s8 3 11 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>`,
  // Skyline: simple building blocks
  skyline: `<rect x="14" y="14" width="5" height="10" fill="#fff"/><rect x="21" y="10" width="6" height="14" fill="#fff"/><rect x="29" y="16" width="5" height="8" fill="#fff"/>`
};
function cityIconSvg(type) {
  const inner = INNER_MARKS[type] ?? INNER_MARKS.skyline;
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${PIN_OUTLINE}" fill="currentColor"/>
    ${inner}
  </svg>`;
}

// src/shared/cities.ts
var CITIES = [
  { name: "\u062A\u0647\u0631\u0627\u0646", province: "\u062A\u0647\u0631\u0627\u0646", lat: 35.6944, lon: 51.4215, icon: "capital" },
  { name: "\u0645\u0634\u0647\u062F", province: "\u062E\u0631\u0627\u0633\u0627\u0646 \u0631\u0636\u0648\u06CC", lat: 36.2605, lon: 59.6168, icon: "landmark" },
  { name: "\u0627\u0635\u0641\u0647\u0627\u0646", province: "\u0627\u0635\u0641\u0647\u0627\u0646", lat: 32.6546, lon: 51.668, icon: "landmark" },
  { name: "\u0634\u06CC\u0631\u0627\u0632", province: "\u0641\u0627\u0631\u0633", lat: 29.5918, lon: 52.5837, icon: "landmark" },
  { name: "\u062A\u0628\u0631\u06CC\u0632", province: "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u0634\u0631\u0642\u06CC", lat: 38.08, lon: 46.2919, icon: "mountain" },
  { name: "\u0627\u0647\u0648\u0627\u0632", province: "\u062E\u0648\u0632\u0633\u062A\u0627\u0646", lat: 31.3183, lon: 48.6706, icon: "coastal" },
  { name: "\u06A9\u0631\u062C", province: "\u0627\u0644\u0628\u0631\u0632", lat: 35.84, lon: 50.9391, icon: "skyline" },
  { name: "\u0642\u0645", province: "\u0642\u0645", lat: 34.6416, lon: 50.8746, icon: "landmark" },
  { name: "\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647", province: "\u06A9\u0631\u0645\u0627\u0646\u0634\u0627\u0647", lat: 34.3142, lon: 47.065, icon: "mountain" },
  { name: "\u0627\u0631\u0648\u0645\u06CC\u0647", province: "\u0622\u0630\u0631\u0628\u0627\u06CC\u062C\u0627\u0646 \u063A\u0631\u0628\u06CC", lat: 37.5527, lon: 45.0761, icon: "mountain" },
  { name: "\u0631\u0634\u062A", province: "\u06AF\u06CC\u0644\u0627\u0646", lat: 37.2809, lon: 49.5832, icon: "coastal" },
  { name: "\u0632\u0627\u0647\u062F\u0627\u0646", province: "\u0633\u06CC\u0633\u062A\u0627\u0646 \u0648 \u0628\u0644\u0648\u0686\u0633\u062A\u0627\u0646", lat: 29.4963, lon: 60.8629, icon: "desert" },
  { name: "\u06A9\u0631\u0645\u0627\u0646", province: "\u06A9\u0631\u0645\u0627\u0646", lat: 30.2839, lon: 57.0834, icon: "desert" },
  { name: "\u06CC\u0632\u062F", province: "\u06CC\u0632\u062F", lat: 31.8974, lon: 54.3569, icon: "desert" },
  { name: "\u0627\u0631\u062F\u0628\u06CC\u0644", province: "\u0627\u0631\u062F\u0628\u06CC\u0644", lat: 38.2498, lon: 48.2933, icon: "mountain" },
  { name: "\u0628\u0646\u062F\u0631\u0639\u0628\u0627\u0633", province: "\u0647\u0631\u0645\u0632\u06AF\u0627\u0646", lat: 27.1865, lon: 56.2808, icon: "coastal" },
  { name: "\u0627\u0631\u0627\u06A9", province: "\u0645\u0631\u06A9\u0632\u06CC", lat: 34.0917, lon: 49.6892, icon: "skyline" },
  { name: "\u0647\u0645\u062F\u0627\u0646", province: "\u0647\u0645\u062F\u0627\u0646", lat: 34.7992, lon: 48.5146, icon: "landmark" },
  { name: "\u06CC\u0627\u0633\u0648\u062C", province: "\u06A9\u0647\u06AF\u06CC\u0644\u0648\u06CC\u0647 \u0648 \u0628\u0648\u06CC\u0631\u0627\u062D\u0645\u062F", lat: 30.6682, lon: 51.588, icon: "mountain" },
  { name: "\u0642\u0632\u0648\u06CC\u0646", province: "\u0642\u0632\u0648\u06CC\u0646", lat: 36.2688, lon: 50.0041, icon: "landmark" },
  { name: "\u0633\u0627\u0631\u06CC", province: "\u0645\u0627\u0632\u0646\u062F\u0631\u0627\u0646", lat: 36.5633, lon: 53.0601, icon: "coastal" },
  { name: "\u0628\u0648\u0634\u0647\u0631", province: "\u0628\u0648\u0634\u0647\u0631", lat: 28.9234, lon: 50.8203, icon: "coastal" },
  { name: "\u0633\u0646\u0646\u062F\u062C", province: "\u06A9\u0631\u062F\u0633\u062A\u0627\u0646", lat: 35.3144, lon: 46.9923, icon: "mountain" },
  { name: "\u0632\u0646\u062C\u0627\u0646", province: "\u0632\u0646\u062C\u0627\u0646", lat: 36.6764, lon: 48.4963, icon: "skyline" },
  { name: "\u0634\u0647\u0631\u06A9\u0631\u062F", province: "\u0686\u0647\u0627\u0631\u0645\u062D\u0627\u0644 \u0648 \u0628\u062E\u062A\u06CC\u0627\u0631\u06CC", lat: 32.3256, lon: 50.8642, icon: "mountain" },
  { name: "\u062E\u0631\u0645\u200C\u0622\u0628\u0627\u062F", province: "\u0644\u0631\u0633\u062A\u0627\u0646", lat: 33.4878, lon: 48.3558, icon: "mountain" },
  { name: "\u0627\u06CC\u0644\u0627\u0645", province: "\u0627\u06CC\u0644\u0627\u0645", lat: 33.6374, lon: 46.4227, icon: "mountain" },
  { name: "\u0628\u06CC\u0631\u062C\u0646\u062F", province: "\u062E\u0631\u0627\u0633\u0627\u0646 \u062C\u0646\u0648\u0628\u06CC", lat: 32.8663, lon: 59.2211, icon: "desert" },
  { name: "\u06AF\u0631\u06AF\u0627\u0646", province: "\u06AF\u0644\u0633\u062A\u0627\u0646", lat: 36.8427, lon: 54.4392, icon: "coastal" },
  { name: "\u0633\u0645\u0646\u0627\u0646", province: "\u0633\u0645\u0646\u0627\u0646", lat: 35.5769, lon: 53.396, icon: "desert" },
  { name: "\u0628\u062C\u0646\u0648\u0631\u062F", province: "\u062E\u0631\u0627\u0633\u0627\u0646 \u0634\u0645\u0627\u0644\u06CC", lat: 37.4747, lon: 57.329, icon: "mountain" }
];

// src/client/theme.ts
var STORAGE_KEY = "havache-theme";
function systemPrefersDark() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function initTheme() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  const theme = saved ?? (systemPrefersDark() ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  window.localStorage.setItem(STORAGE_KEY, next);
}

// src/client/aqi.ts
function classifyAqi(aqi) {
  if (aqi <= 50) return { label: "\u067E\u0627\u06A9 \u0648 \u0633\u0627\u0644\u0645", className: "aqi-card--good" };
  if (aqi <= 100) return { label: "\u0642\u0627\u0628\u0644 \u0642\u0628\u0648\u0644", className: "aqi-card--moderate" };
  if (aqi <= 150) return { label: "\u0646\u0627\u0633\u0627\u0644\u0645 \u0628\u0631\u0627\u06CC \u06AF\u0631\u0648\u0647\u200C\u0647\u0627\u06CC \u062D\u0633\u0627\u0633", className: "aqi-card--sensitive" };
  if (aqi <= 200) return { label: "\u0646\u0627\u0633\u0627\u0644\u0645", className: "aqi-card--unhealthy" };
  if (aqi <= 300) return { label: "\u0628\u0633\u06CC\u0627\u0631 \u0646\u0627\u0633\u0627\u0644\u0645", className: "aqi-card--very-unhealthy" };
  return { label: "\u062E\u0637\u0631\u0646\u0627\u06A9", className: "aqi-card--hazardous" };
}

// src/client/mascot.ts
function mascotSvg(category) {
  const face = FACES[category] ?? FACES.cloudy;
  return `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 46a12 12 0 0 1 1.6-23.9A15.5 15.5 0 0 1 48.5 25H49a10 10 0 0 1 0 20H18z" fill="#fff"/>
    ${face}
  </svg>`;
}
var FACES = {
  sunny: `
    <circle cx="26" cy="32" r="2.6" fill="#0b3d75"/>
    <circle cx="39" cy="32" r="2.6" fill="#0b3d75"/>
    <path d="M24 38q8 7 16 0" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  `,
  cloudy: `
    <path d="M23 32q1.5-2 3 0" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M36 32q1.5-2 3 0" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M25 39q7 4 14 0" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  `,
  fog: `
    <path d="M23 32h5" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M36 32h5" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M27 39q5 2 10 0" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  `,
  rain: `
    <circle cx="26" cy="32" r="2.4" fill="#0b3d75"/>
    <circle cx="39" cy="32" r="2.4" fill="#0b3d75"/>
    <path d="M25 41q7-3 14 0" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <path d="M26 36c0 2.5-3 2.5-3 5a1.6 1.6 0 0 0 3 0c0-2.5-3-2.5 0-5z" fill="#4a9be8"/>
  `,
  snow: `
    <circle cx="26" cy="32" r="2.4" fill="#0b3d75"/>
    <circle cx="39" cy="32" r="2.4" fill="#0b3d75"/>
    <path d="M24 39q2-2 4 0t4 0t4 0t4 0" stroke="#0b3d75" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  `,
  storm: `
    <circle cx="26" cy="31" r="3" fill="#0b3d75"/>
    <circle cx="39" cy="31" r="3" fill="#0b3d75"/>
    <path d="M26 41q6-3 12 0" stroke="#0b3d75" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  `
};

// src/client/heatColor.ts
function heatColor(value, min, max) {
  const range = max - min || 1;
  const t = Math.min(1, Math.max(0, (value - min) / range));
  const stops = [
    [0, [30, 111, 217]],
    // cold: --color-primary blue
    [0.5, [245, 198, 35]],
    // mid: warm yellow
    [1, [217, 83, 30]]
    // hot: warm red-orange
  ];
  let lower = stops[0];
  let upper = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i][0] && t <= stops[i + 1][0]) {
      lower = stops[i];
      upper = stops[i + 1];
      break;
    }
  }
  const span = upper[0] - lower[0] || 1;
  const localT = (t - lower[0]) / span;
  const rgb = lower[1].map((channel, i) => Math.round(channel + (upper[1][i] - channel) * localT));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

// src/client/windCompass.ts
function windCompassSvg(degrees) {
  return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
    <text x="20" y="9" text-anchor="middle" font-size="6" fill="currentColor" opacity="0.55" font-weight="700">N</text>
    <g transform="rotate(${degrees} 20 20)">
      <path d="M20 6l4.5 13h-9z" fill="currentColor"/>
      <path d="M20 34l-3.2-9.5h6.4z" fill="currentColor" opacity="0.35"/>
    </g>
    <circle cx="20" cy="20" r="2" fill="currentColor"/>
  </svg>`;
}

// src/client/app.ts
var DEFAULT_CITY = "\u062A\u0628\u0631\u06CC\u0632";
var WINDY_THRESHOLD_KMH = 35;
var FROST_THRESHOLD_C = 0;
var RAIN_WINDOW_MIN_PROBABILITY = 50;
var OUTLOOK_MIN_PROBABILITY = 10;
var SUGGESTIONS_DEBOUNCE_MS = 250;
var SUGGESTIONS_MIN_LENGTH = 2;
var els = {
  form: document.getElementById("search-form"),
  input: document.getElementById("city-input"),
  searchField: document.querySelector(".search__field"),
  suggestions: document.getElementById("search-suggestions"),
  status: document.getElementById("search-status"),
  themeToggle: document.getElementById("theme-toggle"),
  quickCities: document.getElementById("quick-cities"),
  quickCitiesToggle: document.getElementById("quick-cities-toggle"),
  stateLoading: document.getElementById("state-loading"),
  stateError: document.getElementById("state-error"),
  errorMessage: document.getElementById("error-message"),
  weatherContent: document.getElementById("weather-content"),
  hero: document.getElementById("hero"),
  heroIcon: document.getElementById("hero-icon"),
  heroTemp: document.getElementById("hero-temp"),
  heroCondition: document.getElementById("hero-condition"),
  heroLocation: document.getElementById("hero-location"),
  heroFeelsLike: document.getElementById("hero-feels-like"),
  heroUpdated: document.getElementById("hero-updated"),
  heroTip: document.getElementById("hero-tip"),
  heroMascot: document.getElementById("hero-mascot"),
  heroOutlookIcon: document.getElementById("hero-outlook-icon"),
  heroOutlookText: document.getElementById("hero-outlook-text"),
  heroDaylength: document.getElementById("hero-daylength"),
  aqiCard: document.getElementById("aqi-card"),
  aqiCategory: document.getElementById("aqi-category"),
  aqiNumber: document.getElementById("aqi-number"),
  climateCard: document.getElementById("climate-card"),
  climateText: document.getElementById("climate-text"),
  bestDayCallout: document.getElementById("best-day-callout"),
  weeklyPrecip: document.getElementById("weekly-precip"),
  detailHumidity: document.getElementById("detail-humidity"),
  detailWind: document.getElementById("detail-wind"),
  detailWindDirection: document.getElementById("detail-wind-direction"),
  detailWindCompass: document.getElementById("detail-wind-compass"),
  detailPressure: document.getElementById("detail-pressure"),
  detailUv: document.getElementById("detail-uv"),
  detailVisibility: document.getElementById("detail-visibility"),
  detailSunrise: document.getElementById("detail-sunrise"),
  detailSunset: document.getElementById("detail-sunset"),
  hourlyList: document.getElementById("hourly-list"),
  hourlyChartCaption: document.getElementById("hourly-chart-caption"),
  todayRainWindow: document.getElementById("today-rain-window"),
  dailyList: document.getElementById("daily-list"),
  dailyChartCaption: document.getElementById("daily-chart-caption"),
  extremes: document.getElementById("extremes"),
  extremeHotCity: document.getElementById("extreme-hot-city"),
  extremeHotTemp: document.getElementById("extreme-hot-temp"),
  extremeColdCity: document.getElementById("extreme-cold-city"),
  extremeColdTemp: document.getElementById("extreme-cold-temp"),
  heatmap: document.getElementById("heatmap"),
  heatmapAnalysis: document.getElementById("heatmap-analysis")
};
var HERO_CATEGORY_CLASSES = ["hero--sunny", "hero--cloudy", "hero--fog", "hero--rain", "hero--snow", "hero--storm"];
var AQI_CLASSES = [
  "aqi-card--good",
  "aqi-card--moderate",
  "aqi-card--sensitive",
  "aqi-card--unhealthy",
  "aqi-card--very-unhealthy",
  "aqi-card--hazardous"
];
var CLIMATE_CLASSES = ["climate-card--warmer", "climate-card--cooler", "climate-card--normal"];
var BEST_DAY_IDEAL_TEMP = 24;
function showState(state) {
  els.stateLoading.classList.toggle("state-panel--hidden", state !== "loading");
  els.stateError.classList.toggle("state-panel--hidden", state !== "error");
  els.weatherContent.classList.toggle("state-panel--hidden", state !== "content");
}
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });
}
function formatWeekday(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fa-IR", { weekday: "long" });
}
function setHeroCategory(category) {
  els.hero.classList.remove(...HERO_CATEGORY_CLASSES);
  els.hero.classList.add(`hero--${category}`);
}
function renderOutlook(daily) {
  const upcoming = daily.slice(1);
  const rainyDay = upcoming.find((entry) => entry.precipitationProbability >= OUTLOOK_MIN_PROBABILITY);
  if (!rainyDay) {
    els.heroOutlookIcon.innerHTML = weatherIcon("clear");
    els.heroOutlookText.textContent = "\u062A\u0627 \u06CC\u06A9 \u0647\u0641\u062A\u0647 \u0622\u06CC\u0646\u062F\u0647 \u0628\u0627\u0631\u0634\u06CC \u067E\u06CC\u0634\u200C\u0628\u06CC\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.";
    return;
  }
  const info = describeWeatherCode(rainyDay.weatherCode);
  const weekday = formatWeekday(rainyDay.date);
  const prob = rainyDay.precipitationProbability;
  const precipWord = info.category === "snow" ? "\u0628\u0631\u0641" : info.category === "rain" || info.category === "storm" ? "\u0628\u0627\u0631\u0627\u0646" : "\u0628\u0627\u0631\u0634";
  els.heroOutlookIcon.innerHTML = weatherIcon(info.icon);
  els.heroOutlookText.textContent = `${weekday}: \u0627\u062D\u062A\u0645\u0627\u0644 \u0628\u0627\u0631\u0634 ${precipWord} (${prob}\u066A)`;
}
function renderAqi(airQuality) {
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
function renderTempSummaries(hourly, daily) {
  if (hourly.length > 0) {
    const temps = hourly.map((h) => h.temperature);
    const hottestIdx = temps.indexOf(Math.max(...temps));
    const coldestIdx = temps.indexOf(Math.min(...temps));
    els.hourlyChartCaption.textContent = `\u06AF\u0631\u0645\u200C\u062A\u0631\u06CC\u0646 \u0633\u0627\u0639\u062A: ${formatTime(hourly[hottestIdx].time)} (${Math.round(temps[hottestIdx])}\xB0) \xB7 \u0633\u0631\u062F\u062A\u0631\u06CC\u0646 \u0633\u0627\u0639\u062A: ${formatTime(hourly[coldestIdx].time)} (${Math.round(temps[coldestIdx])}\xB0)`;
  }
  if (daily.length > 0) {
    const maxTemps = daily.map((d) => d.temperatureMax);
    const minTemps = daily.map((d) => d.temperatureMin);
    const hottestDayIdx = maxTemps.indexOf(Math.max(...maxTemps));
    const coldestDayIdx = minTemps.indexOf(Math.min(...minTemps));
    els.dailyChartCaption.textContent = `\u06AF\u0631\u0645\u200C\u062A\u0631\u06CC\u0646 \u0631\u0648\u0632: ${formatWeekday(daily[hottestDayIdx].date)} (${Math.round(maxTemps[hottestDayIdx])}\xB0) \xB7 \u0633\u0631\u062F\u062A\u0631\u06CC\u0646 \u0634\u0628: ${formatWeekday(daily[coldestDayIdx].date)} (${Math.round(minTemps[coldestDayIdx])}\xB0)`;
  }
}
function renderHero(data) {
  const { current, location } = data;
  const info = describeWeatherCode(current.weatherCode);
  setHeroCategory(info.category);
  els.heroIcon.innerHTML = weatherIcon(info.icon);
  els.heroTemp.textContent = `${Math.round(current.temperature)}\xB0`;
  els.heroCondition.textContent = info.label;
  const locationParts = [location.name, location.region, location.country].filter(Boolean);
  els.heroLocation.textContent = locationParts.join("\u060C ");
  els.heroFeelsLike.textContent = `${Math.round(current.apparentTemperature)}\xB0`;
  els.heroUpdated.textContent = formatTime(data.fetchedAt);
  els.heroTip.textContent = conditionTip({
    category: info.category,
    temperature: current.temperature,
    windSpeed: current.windSpeed
  });
  els.heroMascot.innerHTML = mascotSvg(info.category);
  renderOutlook(data.daily);
  renderDayLength(data.daily);
}
function renderDayLength(daily) {
  const today = daily[0];
  const tomorrow = daily[1];
  if (!today) {
    els.heroDaylength.textContent = "";
    return;
  }
  const lengthMinutes = (sunrise, sunset) => Math.round((new Date(sunset).getTime() - new Date(sunrise).getTime()) / 6e4);
  const todayLength = lengthMinutes(today.sunrise, today.sunset);
  const hours = Math.floor(todayLength / 60);
  const minutes = todayLength % 60;
  let text = `\u0637\u0648\u0644 \u0631\u0648\u0632 \u0627\u0645\u0631\u0648\u0632: ${hours} \u0633\u0627\u0639\u062A \u0648 ${minutes} \u062F\u0642\u06CC\u0642\u0647`;
  if (tomorrow) {
    const tomorrowLength = lengthMinutes(tomorrow.sunrise, tomorrow.sunset);
    const diff = tomorrowLength - todayLength;
    if (diff > 0) text += ` (\u062F\u0631 \u062D\u0627\u0644 \u0628\u0644\u0646\u062F\u062A\u0631 \u0634\u062F\u0646\u060C ${diff} \u062F\u0642\u06CC\u0642\u0647 \u062F\u0631 \u0631\u0648\u0632)`;
    else if (diff < 0) text += ` (\u062F\u0631 \u062D\u0627\u0644 \u06A9\u0648\u062A\u0627\u0647\u200C\u062A\u0631 \u0634\u062F\u0646\u060C ${Math.abs(diff)} \u062F\u0642\u06CC\u0642\u0647 \u062F\u0631 \u0631\u0648\u0632)`;
  }
  els.heroDaylength.textContent = text;
}
function renderClimateComparison(comparison) {
  if (!comparison) {
    els.climateCard.classList.add("state-panel--hidden");
    return;
  }
  els.climateCard.classList.remove("state-panel--hidden");
  els.climateCard.classList.remove(...CLIMATE_CLASSES);
  const diff = comparison.diffFromAvgMax;
  if (Math.abs(diff) < 1) {
    els.climateCard.classList.add("climate-card--normal");
    els.climateText.textContent = `\u0646\u0632\u062F\u06CC\u06A9 \u0628\u0647 \u0645\u06CC\u0627\u0646\u06AF\u06CC\u0646 \u0645\u0639\u0645\u0648\u0644 (\u0645\u06CC\u0627\u0646\u06AF\u06CC\u0646: ${comparison.avgMax}\xB0)`;
  } else if (diff > 0) {
    els.climateCard.classList.add("climate-card--warmer");
    els.climateText.textContent = `${diff.toFixed(1)}\xB0 \u06AF\u0631\u0645\u200C\u062A\u0631 \u0627\u0632 \u0645\u0639\u0645\u0648\u0644 (\u0645\u06CC\u0627\u0646\u06AF\u06CC\u0646: ${comparison.avgMax}\xB0)`;
  } else {
    els.climateCard.classList.add("climate-card--cooler");
    els.climateText.textContent = `${Math.abs(diff).toFixed(1)}\xB0 \u062E\u0646\u06A9\u200C\u062A\u0631 \u0627\u0632 \u0645\u0639\u0645\u0648\u0644 (\u0645\u06CC\u0627\u0646\u06AF\u06CC\u0646: ${comparison.avgMax}\xB0)`;
  }
}
function renderBestDay(daily) {
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
  els.bestDayCallout.textContent = `\u2600\uFE0F \u0628\u0647\u062A\u0631\u06CC\u0646 \u0631\u0648\u0632 \u0627\u06CC\u0646 \u0647\u0641\u062A\u0647 \u0628\u0631\u0627\u06CC \u0628\u06CC\u0631\u0648\u0646 \u0631\u0641\u062A\u0646: ${formatWeekday(best.date)} (${Math.round(best.temperatureMax)}\xB0\u060C \u0627\u062D\u062A\u0645\u0627\u0644 \u0628\u0627\u0631\u0634 ${best.precipitationProbability}\u066A)`;
}
function renderDetails(data) {
  const { current, daily } = data;
  const today = daily[0];
  els.detailHumidity.textContent = `${current.humidity}\u066A`;
  els.detailWind.textContent = `${Math.round(current.windSpeed)} \u06A9\u06CC\u0644\u0648\u0645\u062A\u0631/\u0633\u0627\u0639\u062A`;
  els.detailWindDirection.textContent = windDirectionLabel(current.windDirection);
  els.detailWindCompass.innerHTML = windCompassSvg(current.windDirection);
  els.detailPressure.textContent = `${Math.round(current.pressure)} \u0647\u06A9\u062A\u0648\u067E\u0627\u0633\u06A9\u0627\u0644`;
  els.detailUv.textContent = current.uvIndex.toFixed(1);
  els.detailVisibility.textContent = current.visibility ? `${Math.round(current.visibility / 1e3)} \u06A9\u06CC\u0644\u0648\u0645\u062A\u0631` : "\u0646\u0627\u0645\u0634\u062E\u0635";
  if (today) {
    els.detailSunrise.textContent = formatTime(today.sunrise);
    els.detailSunset.textContent = formatTime(today.sunset);
  }
}
function renderWeeklyPrecip(daily) {
  if (daily.length === 0) {
    els.weeklyPrecip.textContent = "";
    return;
  }
  const total = daily.reduce((sum, d) => sum + d.precipitationSum, 0);
  if (total < 0.1) {
    els.weeklyPrecip.textContent = "\u{1F324} \u0628\u0627\u0631\u0634\u06CC \u0628\u0631\u0627\u06CC \u0627\u06CC\u0646 \u0647\u0641\u062A\u0647 \u067E\u06CC\u0634\u200C\u0628\u06CC\u0646\u06CC \u0646\u0645\u06CC\u200C\u0634\u0648\u062F.";
    return;
  }
  els.weeklyPrecip.textContent = `\u{1F327} \u0628\u0627\u0631\u0634 \u062A\u062E\u0645\u06CC\u0646\u06CC \u0627\u06CC\u0646 \u0647\u0641\u062A\u0647: ${total.toFixed(1)} \u0645\u06CC\u0644\u06CC\u200C\u0645\u062A\u0631`;
}
function renderTodayRainWindow(hourly, daily) {
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
  els.todayRainWindow.textContent = start === end ? `\u2614 \u0628\u0627\u0631\u0634 \u0627\u0645\u0631\u0648\u0632 \u062D\u062F\u0648\u062F \u0633\u0627\u0639\u062A ${start} \u067E\u06CC\u0634\u200C\u0628\u06CC\u0646\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F.` : `\u2614 \u0628\u0627\u0631\u0634 \u0627\u0645\u0631\u0648\u0632 \u062D\u062F\u0648\u062F \u0627\u0632 \u0633\u0627\u0639\u062A ${start} \u062A\u0627 ${end} \u067E\u06CC\u0634\u200C\u0628\u06CC\u0646\u06CC \u0645\u06CC\u200C\u0634\u0648\u062F.`;
}
function renderHourly(hourly) {
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
      <span class="hour-row__condition">${info.label} \xB7 ${entry.precipitationProbability}\u066A \u0628\u0627\u0631\u0634</span>
      <span class="hour-row__temp">${Math.round(entry.temperature)}\xB0</span>
    `;
    els.hourlyList.appendChild(li);
  }
}
function renderDaily(daily) {
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
        ${info.label} \xB7 ${entry.precipitationProbability}\u066A \u0628\u0627\u0631\u0634
        ${isWindy ? `<span class="wind-badge" title="\u0628\u0627\u062F \u0646\u0633\u0628\u062A\u0627\u064B \u0634\u062F\u06CC\u062F">${windBadgeSvg()}<span>\u0628\u0627\u062F \u0634\u062F\u06CC\u062F</span></span>` : ""}
        ${isFrost ? `<span class="frost-badge" title="\u0627\u062D\u062A\u0645\u0627\u0644 \u06CC\u062E\u0628\u0646\u062F\u0627\u0646">\u2744\uFE0F<span>\u06CC\u062E\u0628\u0646\u062F\u0627\u0646</span></span>` : ""}
      </span>
      <span class="daily-row__temps">
        <span class="daily-row__temp-max">${Math.round(entry.temperatureMax)}\xB0</span>
        <span class="daily-row__temp-min">${Math.round(entry.temperatureMin)}\xB0</span>
      </span>
    `;
    els.dailyList.appendChild(li);
  }
}
function renderWeather(data) {
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
function setActiveCityCard(city) {
  const cards = els.quickCities.querySelectorAll(".city-card");
  cards.forEach((card) => {
    card.setAttribute("aria-pressed", String(card.dataset.city === city));
  });
}
async function runWeatherFetch(url, activeCityForCards) {
  showState("loading");
  els.status.textContent = "\u062F\u0631 \u062D\u0627\u0644 \u062C\u0633\u062A\u200C\u0648\u062C\u0648\u2026";
  setActiveCityCard(activeCityForCards);
  try {
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) {
      const errorBody = body;
      throw new Error(errorBody.message || "\u062E\u0637\u0627\u06CC \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647 \u0631\u062E \u062F\u0627\u062F.");
    }
    renderWeather(body);
    els.status.textContent = `\u0627\u0637\u0644\u0627\u0639\u0627\u062A \u0622\u0628\u200C\u0648\u0647\u0648\u0627\u06CC ${body.location.name} \u0646\u0645\u0627\u06CC\u0634 \u062F\u0627\u062F\u0647 \u0634\u062F.`;
  } catch (err) {
    const message = err instanceof Error ? err.message : "\u062E\u0637\u0627\u06CC \u0646\u0627\u0634\u0646\u0627\u062E\u062A\u0647 \u0631\u062E \u062F\u0627\u062F.";
    els.errorMessage.textContent = message;
    showState("error");
    els.status.textContent = message;
  }
}
function fetchWeather(city) {
  return runWeatherFetch(`/api/weather?city=${encodeURIComponent(city)}`, city);
}
function fetchWeatherByLocation(loc) {
  const params = new URLSearchParams({
    lat: String(loc.latitude),
    lon: String(loc.longitude),
    name: loc.name,
    country: loc.country,
    timezone: loc.timezone
  });
  if (loc.admin1) params.set("region", loc.admin1);
  return runWeatherFetch(`/api/weather?${params.toString()}`, loc.name);
}
function renderQuickCities() {
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
function renderHeatmap(cities) {
  if (cities.length === 0) return;
  const temps = cities.map((c) => c.temperature);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  els.heatmap.innerHTML = cities.map((city) => {
    const color = heatColor(city.temperature, min, max);
    return `
        <div class="heatmap__cell" style="background:${color}">
          <span class="heatmap__cell-name">${city.name}</span>
          <span class="heatmap__cell-temp">${Math.round(city.temperature)}\xB0</span>
        </div>`;
  }).join("");
  const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
  let rainCount = 0;
  let snowCount = 0;
  for (const city of cities) {
    const category = describeWeatherCode(city.weatherCode).category;
    if (category === "rain" || category === "storm") rainCount++;
    else if (category === "snow") snowCount++;
  }
  const parts = [`\u0645\u06CC\u0627\u0646\u06AF\u06CC\u0646 \u062F\u0645\u0627\u06CC ${cities.length} \u0627\u0633\u062A\u0627\u0646 \u06A9\u0634\u0648\u0631: ${avgTemp.toFixed(1)}\xB0`];
  if (rainCount > 0) parts.push(`${rainCount} \u0627\u0633\u062A\u0627\u0646 \u0628\u0627\u0631\u0634 \u0628\u0627\u0631\u0627\u0646 \u062F\u0627\u0631\u0646\u062F`);
  if (snowCount > 0) parts.push(`${snowCount} \u0627\u0633\u062A\u0627\u0646 \u0628\u0627\u0631\u0634 \u0628\u0631\u0641 \u062F\u0627\u0631\u0646\u062F`);
  if (rainCount === 0 && snowCount === 0) parts.push("\u062F\u0631 \u062D\u0627\u0644 \u062D\u0627\u0636\u0631 \u0628\u0627\u0631\u0634\u06CC \u062F\u0631 \u06A9\u0634\u0648\u0631 \u06AF\u0632\u0627\u0631\u0634 \u0646\u0634\u062F\u0647 \u0627\u0633\u062A");
  els.heatmapAnalysis.textContent = parts.join(" \xB7 ");
}
async function loadHighlights() {
  try {
    const response = await fetch("/api/highlights");
    if (!response.ok) return;
    const data = await response.json();
    if (data.hottest) {
      els.extremeHotCity.textContent = data.hottest.name;
      els.extremeHotTemp.textContent = `${Math.round(data.hottest.temperature)}\xB0`;
    }
    if (data.coldest) {
      els.extremeColdCity.textContent = data.coldest.name;
      els.extremeColdTemp.textContent = `${Math.round(data.coldest.temperature)}\xB0`;
    }
    if (data.cities?.length > 0) {
      renderHeatmap(data.cities);
    }
    if (data.hottest || data.coldest) {
      els.extremes.classList.remove("state-panel--hidden");
    }
  } catch {
  }
}
var suggestionsDebounceTimer;
var currentSuggestions = [];
var activeSuggestionIndex = -1;
function closeSuggestions() {
  els.suggestions.classList.remove("search__suggestions--open");
  els.suggestions.innerHTML = "";
  currentSuggestions = [];
  activeSuggestionIndex = -1;
  els.input.setAttribute("aria-expanded", "false");
}
function updateActiveSuggestion(optionEls) {
  optionEls.forEach((el, i) => el.classList.toggle("search__suggestion--active", i === activeSuggestionIndex));
}
function renderSuggestions(items) {
  currentSuggestions = items;
  activeSuggestionIndex = -1;
  if (items.length === 0) {
    closeSuggestions();
    return;
  }
  els.suggestions.innerHTML = items.map(
    (item, i) => `
      <li class="search__suggestion" role="option" data-index="${i}">
        <span>${item.name}</span>
        <span class="search__suggestion-region">${[item.admin1, item.country].filter(Boolean).join("\u060C ")}</span>
      </li>`
  ).join("");
  els.suggestions.classList.add("search__suggestions--open");
  els.input.setAttribute("aria-expanded", "true");
}
async function fetchSuggestions(query) {
  if (query.trim().length < SUGGESTIONS_MIN_LENGTH) {
    closeSuggestions();
    return;
  }
  try {
    const response = await fetch(`/api/geocode?query=${encodeURIComponent(query)}`);
    if (!response.ok) return;
    const items = await response.json();
    renderSuggestions(items);
  } catch {
  }
}
function selectSuggestion(item) {
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
  const optionEls = Array.from(els.suggestions.querySelectorAll(".search__suggestion"));
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
  const li = event.target.closest(".search__suggestion");
  if (!li) return;
  const index = Number(li.dataset.index);
  const item = currentSuggestions[index];
  if (item) selectSuggestion(item);
});
document.addEventListener("click", (event) => {
  if (!els.searchField.contains(event.target)) {
    closeSuggestions();
  }
});
els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  closeSuggestions();
  const value = els.input.value.trim();
  if (!value) {
    els.status.textContent = "\u0644\u0637\u0641\u0627\u064B \u0646\u0627\u0645 \u06CC\u06A9 \u0634\u0647\u0631 \u0631\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F.";
    return;
  }
  fetchWeather(value);
});
els.themeToggle.addEventListener("click", toggleTheme);
els.quickCities.addEventListener("click", (event) => {
  const target = event.target.closest(".city-card");
  if (!target?.dataset.city) return;
  els.input.value = target.dataset.city;
  fetchWeather(target.dataset.city);
});
els.quickCitiesToggle.addEventListener("click", () => {
  const collapsed = els.quickCities.classList.toggle("quick-cities__grid--collapsed");
  els.quickCitiesToggle.setAttribute("aria-expanded", String(!collapsed));
  els.quickCitiesToggle.textContent = collapsed ? "\u0646\u0645\u0627\u06CC\u0634 \u0647\u0645\u0647 \u0634\u0647\u0631\u0647\u0627" : "\u0646\u0645\u0627\u06CC\u0634 \u06A9\u0645\u062A\u0631";
});
initTheme();
renderQuickCities();
els.input.value = DEFAULT_CITY;
fetchWeather(DEFAULT_CITY);
loadHighlights();
