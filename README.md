# هواچه — Persian Weather Site

سایت آب‌وهوای فارسی (RTL) با داده‌ی Open-Meteo. **کاملاً استاتیک است**: بدون سرور، بدون دیتابیس، بدون کلید API.
مرورگر مستقیم از Open-Meteo داده می‌گیرد و نتیجه‌ها را چند دقیقه در `localStorage` کش می‌کند.

A fully static site (TypeScript → one JS bundle). It calls Open-Meteo straight from the browser
(free, keyless, CORS-enabled), so it can be hosted anywhere that serves files.

## Run locally

```bash
npm install
npm run build      # -> dist/
npm run preview    # http://localhost:3000
```

`npm run typecheck` type-checks the client code.

## Deploy

**GitHub Pages** (works at `username.github.io/repo-name/` — all paths are relative):
1. Push this repo to GitHub (branch `main`).
2. Repo → Settings → Pages → Source: **GitHub Actions**.
3. Every push runs `.github/workflows/pages.yml`, which builds and publishes `dist/`.

**Cloudflare Pages**: connect the repo, build command `npm run build`, output directory `dist`.

**Any other static host**: upload the contents of `dist/`.

## Features

- Current conditions with an animated icon, mascot, plain-language tip, day length, 7-day rain/snow outlook
- Air quality (US AQI) and comparison with the 10-year average for today's date
- Details grid (humidity, wind + compass, pressure, UV, visibility, sunrise/sunset)
- 24-hour and 7-day forecasts as matching row lists, side by side on desktop, with a blue→red
  temperature color bar per row; frost and strong-wind badges; today's rain window; weekly precipitation total; best day of the week
- 31 provincial capitals as quick-pick cards, autocomplete search for any city
- Nationwide hottest/coldest city and a color heatmap of all 31 capitals
- Light/dark theme, mobile-first layout

## How data and caching work

| What | Source | Cached (localStorage) |
|---|---|---|
| Forecast, air quality | `api.open-meteo.com`, `air-quality-api.open-meteo.com` | 10 min |
| 10-year climate average | `archive-api.open-meteo.com` | 24 h |
| City autocomplete | `geocoding-api.open-meteo.com` | 10 min |
| 31-city heatmap (one batched request) | `api.open-meteo.com` | 10 min |

The 31 provincial capitals have built-in coordinates (`src/shared/cities.ts`), so picking one needs no geocoding.
Expired cache entries are pruned on startup. If storage is unavailable the site still works, just without caching.

Open-Meteo's free tier is for non-commercial use; limits are per visitor IP, which is why browser-side calls scale well.

## Project structure

```
src/
  shared/cities.ts        # 31 provincial capitals (name, province, lat/lon, icon type)
  client/
    index.html            # page shell (RTL, Persian, ARIA)
    styles.css            # light/dark theme, layout, animations
    app.ts                # UI wiring + rendering
    api.ts                # Open-Meteo calls + data shaping (browser port of the old server routes)
    cache.ts              # localStorage TTL cache
    types.ts              # shared data types
    weatherCodes.ts, icons.ts, cityIcons.ts, mascot.ts, windCompass.ts, aqi.ts, heatColor.ts, theme.ts
scripts/
  copy-static.mjs         # copies assets into dist/, content-hashes JS/CSS, keeps paths relative
  clean.mjs, preview.mjs
.github/workflows/pages.yml
```
