# هواچه — Persian Weather App

A production-ready, Persian-language weather analysis and display application.
Search any city, see current conditions, an hourly rail for the next 24 hours,
and a 7-day forecast — all labeled in Persian, laid out right-to-left.

## What's new in this pass

- **Never opens empty**: loads تبریز (Tabriz) automatically on page load.
- **Quick-select city cards**: a row of square, tappable cards for major
  Iranian cities (تهران، مشهد، اصفهان، شیراز، تبریز، اهواز، کرج، قم) sits above
  the results — tap one instead of typing.
- **Animated, condition-aware icons**: every icon (hero, hourly, daily) is a
  small animated SVG — rays pulse on sunny days, clouds drift, raindrops and
  snowflakes fall, storm bolts flash, fog lines fade in and out.
- **Weekly forecast is visually distinct by condition**: each day in the
  7-day list is tinted and left-bordered by its weather category (sunny /
  cloudy / fog / rain / snow / storm), and a windy day gets an animated wind
  badge.
- **Plain-language tip**: the hero card shows a short, practical suggestion
  ("چتر همراه داشته باشید", "از کرم ضدآفتاب استفاده کنید"، etc.) based on the
  current conditions, aimed at making the app immediately useful to a
  non-technical visitor.
- **Rebranded** to هواچه, with a custom sun/cloud speech-bubble mark used as
  both the header logo and the favicon (`favicon.svg`).
- **Stronger mobile pass**: sticky, blurred header; 16px inputs (no iOS
  auto-zoom); 44px+ tap targets; a 3-column quick-city grid and tighter
  spacing under 480px; safe-area padding for notched phones.

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
  server/
    index.ts            # Express app: serves public/, mounts /api
    routes/weather.ts    # Geocoding + forecast fetch, response shaping
    types/weather.ts      # Shared response/domain types
  client/
    index.html            # Page shell (RTL, Persian labels, ARIA)
    styles.css             # Sky-gradient theme, responsive layout
    app.ts                  # Fetch, render, debounced search, scroll controls
    weatherCodes.ts          # WMO code -> Persian label, icon key, category, tip text
    icons.ts                  # Animated inline SVG weather icon set + wind badge
    favicon.svg                # هواچه logo mark, used as favicon and header logo source
public/                       # Build output served statically (generated)
scripts/copy-static.mjs        # Copies index.html/styles.css into public/
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
