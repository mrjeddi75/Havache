import type { IconKey } from "./weatherCodes.js";

/**
 * Every icon is a self-contained <svg>. Moving parts use classes
 * (.ray, .cloud-shape, .drop, .flake, .bolt, .fog-line) that
 * styles.css animates with CSS keyframes. Wrapping markup in
 * `weatherIcon()` adds the outer container class so a single CSS
 * rule can theme+animate a whole icon by key.
 */

const ICONS: Record<IconKey, string> = {
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
  </svg>`,
};

export function weatherIconSvg(key: IconKey): string {
  return ICONS[key] ?? ICONS.cloudy;
}

/** Wraps the raw SVG with a container class so CSS can theme+animate by icon key. */
export function weatherIcon(key: IconKey): string {
  return `<span class="weather-icon weather-icon--${key}">${weatherIconSvg(key)}</span>`;
}

/** Small standalone animated wind glyph, used as a badge on windy forecast entries. */
export function windBadgeSvg(): string {
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
