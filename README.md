# هواچه — Persian Weather App

A production-ready, Persian-language weather analysis and display application.
Search any city, see current conditions, an hourly rail for the next 24 hours,
and a 7-day forecast — all labeled in Persian, laid out right-to-left.

## What's new in this pass

- **Fixed the mobile search-bar bug**: the header previously combined
  `position: sticky` with `backdrop-filter`, a combination that some
  Android WebViews (common on budget/older phones) render incorrectly,
  reserving extra blank space around the search row. The header is now a
  plain, non-sticky block with a simple column layout — no filter effects,
  no ambiguous wrapping.
- **Real cache-busting**: `app.js` and `styles.css` are now served with a
  content-hash query string (`app.js?v=<hash>`) computed at build time
  (`scripts/copy-static.mjs`), and `index.html` is served with
  `Cache-Control: no-cache` while the hashed assets get a 1-year
  `immutable` cache. This is almost certainly what caused the "already
  fixed once, still shows the old layout" symptom — the browser was
  serving a stale cached `app.js`/`index.html` pair after redeploying.
  Every future deploy with changed content gets a new URL automatically.
- **Server-side response caching**: `/api/weather`, `/api/highlights`, and
  `/api/geocode` all cache upstream Open-Meteo responses in memory for
  ~10 minutes, so many people requesting the same city (or the app's own
  batched highlights lookup) within that window don't each trigger a
  fresh upstream call.
- **Air quality (AQI)**: each city's weather box now shows a color-coded
  US AQI card (پاک و سالم → خطرناک) sourced from Open-Meteo's Air Quality
  API, fetched in parallel with the forecast.
- **24h / 7-day temperature charts**: a small dependency-free inline SVG
  line chart (`src/client/chart.ts`) now sits above the hourly cards
  (temperature trend) and above the daily list (max/min band across the
  week).
- **Autocomplete**: typing in the search box (2+ characters) now shows a
  dropdown of matching cities from Open-Meteo's geocoding API instead of
  re-fetching full weather data on every keystroke — arrow keys navigate,
  Enter/click selects, and selecting a suggestion sends its coordinates
  straight to `/api/weather` (skipping a second geocode round-trip on the
  server).
- **Dark mode**: a header toggle switches between light and dark palettes
  (`src/client/theme.ts`), respecting the system's `prefers-color-scheme`
  on first visit and remembering the choice in `localStorage`.
- **31 quick-select city cards** (previous pass): every Iranian
  provincial capital, collapsed to 10 with a "نمایش همه شهرها" toggle,
  using custom SVG pin icons themed by city type.
- **Animated, condition-aware icons, weekly-forecast tinting, ~4-day
  precipitation outlook, and hottest/coldest city comparison** (previous
  pass) — see below for details on each.

Carried over from earlier passes: the page never opens empty (defaults to
تبریز), every icon is a small animated SVG matched to the condition, each
day in the 7-day list is tinted by weather category with a wind badge on
windy days, a plain-language tip and a ~4-day rain/snow outlook sit under
the current temperature, and the app is rebranded to هواچه with a custom
sun/cloud logo used as both the header mark and the favicon.

## A note on the weather provider

The brief referenced both OpenWeatherMap (for icons) and Open-Meteo (for the
API/`WEATHER_API_KEY`). This build standardizes on **Open-Meteo** end to end:
it's free, requires no API key, and its geocoding endpoint (`/v1/search`)
gives city search "for free" alongside the forecast endpoint. Its weather
codes are the WMO numeric codes rather than icon URLs, so this app ships its
own small set of inline SVG icons mapped to Persian condition labels
(`src/client/weatherCodes.ts` and `src/client/icons.ts`) instead of pulling
an icon set from OpenWeatherMap. `WEATHER_API_KEY` is still read from the
environment for forward-compatibility, but the app runs fine with it unset.

## Getting started

```bash
npm install
cp .env.example .env   # optional — defaults work out of the box
npm run build           # compiles the server (tsc) and bundles the client (esbuild)
npm start                # starts Express on http://localhost:3000
```

Or, during development, `npm run dev` runs build + start in one step.

Open `http://localhost:3000` and search for a city (e.g. `تهران`, `Tokyo`,
`Berlin` — the geocoder accepts Persian or Latin spellings).

## Project structure

```
src/
  shared/
    cities.ts               # Iran's 31 provincial capitals (name, lat/lon, icon type)
  server/
    index.ts                 # Express app: static serving (with cache headers) + /api
    routes/weather.ts         # Geocode/direct-coords -> forecast + AQI, cached
    routes/highlights.ts       # Batched current-temp lookup -> hottest/coldest, cached
    routes/geocode.ts           # Autocomplete suggestions, cached
    utils/cache.ts                # Minimal in-memory TTL cache used by all three routes
    types/weather.ts                # Shared response/domain types
  client/
    index.html                # Page shell (RTL, Persian labels, ARIA)
    styles.css                 # Theme (light/dark), layout, icon + chart styling
    app.ts                      # Fetch, render, autocomplete, charts, theme wiring
    theme.ts                     # Dark-mode init/toggle (localStorage + system preference)
    aqi.ts                        # US AQI number -> Persian category + CSS class
    chart.ts                       # Dependency-free inline SVG line chart builder
    weatherCodes.ts                 # WMO code -> Persian label, icon key, category, tip text
    icons.ts                         # Animated inline SVG weather icon set + wind badge
    cityIcons.ts                      # Custom pin-based SVG icons per city type
    favicon.svg                        # هواچه logo mark, used as favicon and header logo source
public/                                # Build output served statically (generated)
scripts/copy-static.mjs                 # Copies static assets, content-hashes JS/CSS, rewrites HTML
```

## How it works

1. The user types a city and submits the search (debounced 300ms while
   typing, or immediately on submit).
2. The client calls `GET /api/weather?city=...`.
3. The server geocodes the city name via Open-Meteo's geocoding API, then
   requests current, hourly, and daily data from Open-Meteo's forecast API
   for those coordinates, and reshapes the response into a compact JSON
   contract (`WeatherResponse`).
4. The client renders: a hero card (icon, temperature, feels-like,
   condition), a details grid (humidity, wind speed/direction, pressure, UV
   index, visibility, sunrise/sunset), a horizontally scrollable 24-hour
   rail, and a 7-day list.

All text is Persian; numbers use standard Arabic numerals (0-9) for
readability and consistency with the temperature/percentage values coming
straight from the API, while units and labels (رطوبت, فشار هوا, etc.) are in
Persian. Times are formatted in the `fa-IR` locale.

## Accessibility

- Semantic sectioning (`header`, `main`, `footer`, `section`) with `aria-label`s.
- Live region (`role="status"`, `aria-live="polite"`) announces search state.
- Visible focus states on the input, button, and scroll controls.
- `prefers-reduced-motion` disables animation/smooth-scroll.
- `prefers-contrast: more` increases border/text contrast.
- The hourly rail is keyboard-focusable and scrollable, with dedicated
  scroll buttons as an alternative to drag/scroll gestures.

## No API key required

Unlike the original brief's mention of `WEATHER_API_KEY`, Open-Meteo's
forecast and geocoding endpoints used here do not require authentication.
The `.env.example` variable is present but can be left blank.
