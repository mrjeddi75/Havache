/**
 * Interpolates a temperature within [min, max] to a color along a
 * cold-to-hot scale: blue -> yellow -> red. Used to color the 31-city
 * heatmap grid.
 */
export function heatColor(value: number, min: number, max: number): string {
  const range = max - min || 1;
  const t = Math.min(1, Math.max(0, (value - min) / range));

  const stops: [number, [number, number, number]][] = [
    [0, [30, 111, 217]], // cold: --color-primary blue
    [0.5, [245, 198, 35]], // mid: warm yellow
    [1, [217, 83, 30]], // hot: warm red-orange
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
