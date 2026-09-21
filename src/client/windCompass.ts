/**
 * A small compass dial with a needle rotated to the wind direction
 * (meteorological convention: the degree is the direction the wind is
 * blowing FROM, so at 0° the needle points north).
 */
export function windCompassSvg(degrees: number): string {
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
