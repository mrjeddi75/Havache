# هواچه — Persian Weather App

A production-ready, Persian-language weather analysis and display application.
Search any city, see current conditions, an hourly rail for the next 24 hours,
and a 7-day forecast — all labeled in Persian, laid out right-to-left.

## What's new in this pass

- **Charts removed, replaced with a color-spectrum indicator per row**:
  both line charts are gone entirely. Instead, every row in the hourly
  and weekly lists now has a small rounded color bar right before the
  time/day (blue → yellow → red, scaled to that list's own min/max) so
  the hottest and coldest points are visible at a glance without a
  separate graph. The "hottest/coldest hour" and "hottest/coldest day"
  text captions stayed — they were already independent of the chart
  rendering, just useful quick-read summaries.
- **Fixed the hourly/weekly panels rendering at very unequal widths on
  desktop**: this was a classic CSS Grid gotcha — grid items don't
  shrink below their content's intrinsic width by default, and the old
  hourly chart's minimum width (sized for 24 data points) was forcing
  its column much wider than its fair 50/50 share, squeezing the weekly
  panel. Added `min-width: 0` to both panels so they now split the row
  evenly regardless of content, and removing the charts eliminates the
  oversized content that triggered it in the first place.
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
- **Readable charts**: both the 24h and 7-day temperature charts now have
  x-axis time/day labels, light gridlines, the hottest and coldest point
  called out directly on the chart with its value, and a plain-text
  caption underneath ("گرم‌ترین ساعت: ۱۵:۰۰ (۲۸°) · سردترین ساعت: ۰۴:۰۰
  (۱۲°)") — a bare line didn't tell you *when* it's hot or cold, so now
  both the visual and the text say so explicitly.
- **Visual redesign — minimal and cleaner, on mobile too**:
  - Flat `border: 1px solid` on every card/panel/input replaced with a
    soft two-layer shadow system (with its own dark-mode variant), so the
    page reads as a set of calm, layered surfaces instead of boxed-in
    tiles.
  - Dropped the full-color category backgrounds on hourly cards and
    daily rows — color now lives only in the icon (and a slim accent for
    AQI/climate severity), not the whole card, which was making every
    screen feel busy.
  - Hottest/coldest cards went from a solid gradient fill to a neutral
    card with colored text — same information, less visual noise.
  - Bumped the base spacing scale and hero temperature size for a
    stronger sense of hierarchy, with a separate (tighter) spacing pass
    on mobile so the extra breathing room doesn't turn into extra
    scrolling on small screens.
  - **Hourly and 7-day charts now sit side by side on desktop**
    (`min-width: 1024px`) and stack normally on tablet and mobile.
  - **"Important info" moved to right under the weekly forecast**: a new
    grouped card holds the best-day callout, weekly precipitation total,
    and today's rain window (divided by thin separators instead of being
    three separate colored pills), immediately followed by the
    hottest/coldest + heatmap section.
- **24-hour forecast now matches the weekly forecast's layout**: the
  horizontal-scrolling hour cards (with their own scroll buttons) are
  gone — hourly data now reads as the exact same row-list pattern as the
  7-day forecast (time / icon / condition / temperature), just capped at
  a fixed height with its own internal scroll so it stays roughly the
  same height as the 7-row weekly list when the two sit side by side.
  Icon sizes, row padding, hover state, and the mobile column layout are
  now identical between the two lists — same component, different data.
- **Chart text moved completely out of the SVG (font fix, for real this
  time)**: rather than patching the font-family on `<svg><text>`
  elements, every label — x-axis days/times and the peak/trough value
  callouts — is now rendered as ordinary HTML `<span>`s absolutely
  positioned over a text-free SVG (just lines, gridlines, and dot
  markers). Since it's real HTML, it always inherits Vazirmatn from the
  page; there's no SVG-text fallback-font path left to mismatch.
- **Weekly precipitation total** — a pill above the 7-day chart sums
  `precipitation_sum` across all 7 days ("🌧 بارش تخمینی این هفته: ۱۲.۳
  میلی‌متر", or a plain "no rain expected" message for a dry week).
- **Frost warning** — any day in the weekly list with a low temperature
  below 0° gets a "❄️ یخبندان" badge, the same pattern as the existing
  high-wind badge.
- **Today's rain start/end window** — a caption under the hourly chart
  uses the hourly `precipitation` amount (not just probability) to say
  e.g. "☔ بارش امروز حدود از ساعت ۱۴:۰۰ تا ۱۸:۰۰ پیش‌بینی می‌شود."
- **Wind compass** — a small SVG dial with a needle rotated to the
  current wind direction sits next to the text label in the details
  grid.
  - The coldest-point value label on a chart could land exactly on top of
    the x-axis day label when the lowest point fell at the very bottom of
    the plot (visible as "15°" overlapping "دوشنبه"). The label position
    is now clamped so it can never reach the axis-label zone.
  - The "rain/snow in ~4 days" line now scans the *entire* week ahead
    instead of checking one fixed day — if nothing's expected all week it
    says so plainly ("تا یک هفته آینده بارشی پیش‌بینی نمی‌شود"), and if a
    day does have rain or snow, it names that day and its probability.
  - The hero tip now uses clear temperature bands (>40° "خیلی گرمه،
    مراقب خودت باش", >30° sunscreen advice, <20° "مراقب باش سرما نخوری",
    otherwise "هوا خوبه، لذت ببرید") and friendlier rain/snow wording
    ("امروز بارون می‌باره، چتر داشته باش" / "از بارش برف لذت ببر!").
  - The heatmap now has a one-line analysis underneath: the 31-province
    average temperature, and how many provinces currently have rain vs.
    snow (only precipitation is called out, as requested).
  1. **Day-length trend** — "طول روز امروز: ۱۳ ساعت و ۴۲ دقیقه (در حال
     بلندتر شدن، ۲ دقیقه در روز)", computed from today vs. tomorrow's
     sunrise/sunset, no extra API call.
  2. **Historical climate comparison** — a new card next to AQI shows
     whether today is warmer/cooler than the average for this same
     calendar date over the last 10 years, using Open-Meteo's free
     Archive API in a single request (`fetchClimateComparison` in
     `weather.ts`), cached 24h since it barely changes within a day.
  3. **Nationwide temperature heatmap** — `/api/highlights` now returns
     all 31 provincial capitals' current temperatures (not just
     hottest/coldest), rendered as a color-graded grid (blue → yellow →
     red) at the bottom of the page.
  4. **"Best day this week"** — a callout above the weekly chart picks
     the most comfortable day using a simple score (mild temperature,
     low rain chance, low wind) computed client-side from data already
     in the response.
  5. **هواچه mascot** — a small cloud-character SVG next to the tip text
     whose face expression changes with the weather category (happy in
     the sun, sleepy in fog, shivering in snow, startled in a storm).
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
    routes/weather.ts         # Geocode/direct-coords -> forecast + AQI + climate, cached
    routes/highlights.ts       # Batched current-temp lookup -> extremes + full city list, cached
    routes/geocode.ts           # Autocomplete suggestions, cached
    utils/cache.ts                # Minimal in-memory TTL cache used by all routes
    types/weather.ts                # Shared response/domain types
  client/
    index.html                # Page shell (RTL, Persian labels, ARIA)
    styles.css                 # Theme (light/dark), layout, icon + heatmap styling
    app.ts                      # Fetch, render, autocomplete, theme wiring
    theme.ts                     # Dark-mode init/toggle (localStorage + system preference)
    aqi.ts                        # US AQI number -> Persian category + CSS class
    mascot.ts                      # هواچه mascot SVG, expression keyed by weather category
    heatColor.ts                    # Blue->yellow->red interpolation (heatmap + row heat-bars)
    weatherCodes.ts                  # WMO code -> Persian label, icon key, category, tip text
    icons.ts                          # Animated inline SVG weather icon set + wind badge
    cityIcons.ts                       # Custom pin-based SVG icons per city type
    favicon.svg                          # هواچه logo mark, used as favicon and header logo source
public/                                  # Build output served statically (generated)
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
