export interface ChartSeries {
  values: number[];
  colorVar: string; // CSS variable name, e.g. "--color-primary"
}

/**
 * Builds a simple responsive SVG line chart. Keeps things dependency-free
 * (no charting library) since the app only ever needs two small line
 * charts. All series share the same x-axis (equal-length `values`
 * arrays) and are scaled together so multiple lines (e.g. daily max/min)
 * stay comparable.
 */
export function buildLineChart(series: ChartSeries[], labels: string[], height = 120): string {
  const width = Math.max(labels.length * 44, 280);
  const paddingX = 20;
  const paddingY = 16;

  const allValues = series.flatMap((s) => s.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const stepX = (width - paddingX * 2) / Math.max(labels.length - 1, 1);

  function pointsFor(values: number[]): string {
    return values
      .map((v, i) => {
        const x = paddingX + i * stepX;
        const y = paddingY + (1 - (v - min) / range) * (height - paddingY * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const lines = series
    .map(
      (s) =>
        `<polyline points="${pointsFor(s.values)}" fill="none" stroke="var(${s.colorVar})" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join("");

  const lastSeries = series[0];
  const dots = lastSeries
    ? lastSeries.values
        .map((v, i) => {
          const x = paddingX + i * stepX;
          const y = paddingY + (1 - (v - min) / range) * (height - paddingY * 2);
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="var(${lastSeries.colorVar})"/>`;
        })
        .join("")
    : "";

  return `<svg class="line-chart__svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    ${lines}
    ${dots}
  </svg>`;
}
