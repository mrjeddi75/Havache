import type { CityIconType } from "../shared/cities.js";

/**
 * A shared "pin" outline with a different silhouette inside it per city
 * type, so 31 cities read as a coherent icon system instead of random
 * emoji. All strokes use currentColor so CSS controls the color.
 */
const PIN_OUTLINE = `M24 4C15.2 4 8 11.2 8 20c0 12 16 24 16 24s16-12 16-24C40 11.2 32.8 4 24 4z`;

const INNER_MARKS: Record<CityIconType, string> = {
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
  skyline: `<rect x="14" y="14" width="5" height="10" fill="#fff"/><rect x="21" y="10" width="6" height="14" fill="#fff"/><rect x="29" y="16" width="5" height="8" fill="#fff"/>`,
};

export function cityIconSvg(type: CityIconType): string {
  const inner = INNER_MARKS[type] ?? INNER_MARKS.skyline;
  return `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="${PIN_OUTLINE}" fill="currentColor"/>
    ${inner}
  </svg>`;
}
