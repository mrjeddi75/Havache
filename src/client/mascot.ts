import type { Category } from "./weatherCodes.js";

/**
 * A simple rounded cloud-character face, expression keyed by weather
 * category. Lives in the hero card next to the tip text so it feels like
 * "هواچه" is the one telling you the forecast.
 */
export function mascotSvg(category: Category): string {
  const face = FACES[category] ?? FACES.cloudy;
  return `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M18 46a12 12 0 0 1 1.6-23.9A15.5 15.5 0 0 1 48.5 25H49a10 10 0 0 1 0 20H18z" fill="#fff"/>
    ${face}
  </svg>`;
}

const FACES: Record<Category, string> = {
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
  `,
};
