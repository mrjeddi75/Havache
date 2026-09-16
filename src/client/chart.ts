export interface ChartSeries {
  values: number[];
  colorVar: string;
}

export interface BuildChartOptions {
  height?: number;
  unit?: string;
  /** Thin the x-axis labels down to roughly this many, evenly spaced. */
  maxLabels?: number;
  /**
   * Which series to highlight the max point of, and which to highlight
   * the min point of. Defaults to series[0] for both (single-series
   * charts). For a two-series max/min chart, pass {maxOf: 0, minOf: 1}
   * so the hottest mark comes from the max line and the coldest mark
   * comes from the min line.
   */
  maxOf?: number;
  minOf?: number;
}

/**
 * Builds a small, dependency-free SVG line chart with gridlines, x-axis
 * labels, and the peak/trough points called out with their value — a
 * bare polyline doesn't tell a general audience *when* it's hot or cold,
 * so every chart in this app is rendered through this function rather
 * than a plain line.
 */
export function buildLineChart(series: ChartSeries[], xLabels: string[], options: BuildChartOptions = {}): string {
  const height = options.height ?? 150;
  const unit = options.unit ?? "°";
  const maxLabels = options.maxLabels ?? Math.min(xLabels.length, 8);
  const maxOfIndex = options.maxOf ?? 0;
  const minOfIndex = options.minOf ?? 0;

  const pointCount = xLabels.length;
  if (pointCount === 0 || series.length === 0) return "";

  const width = Math.max(pointCount * 52, 280);
  const paddingX = 22;
  const paddingTop = 26; // room for the "hottest point" value label
  const paddingBottom = 36; // room for x-axis labels + clearance from the "coldest point" value label
  const plotHeight = height - paddingTop - paddingBottom;

  const allValues = series.flatMap((s) => s.values);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const stepX = (width - paddingX * 2) / Math.max(pointCount - 1, 1);

  const xAt = (i: number) => paddingX + i * stepX;
  const yAt = (v: number) => paddingTop + (1 - (v - min) / range) * plotHeight;

  const gridLines = [0, 0.5, 1]
    .map((t) => {
      const y = (paddingTop + t * plotHeight).toFixed(1);
      return `<line x1="${paddingX}" y1="${y}" x2="${(width - paddingX).toFixed(1)}" y2="${y}" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="3,4"/>`;
    })
    .join("");

  const lines = series
    .map((s) => {
      const points = s.values.map((v, i) => `${xAt(i).toFixed(1)},${yAt(v).toFixed(1)}`).join(" ");
      return `<polyline points="${points}" fill="none" stroke="var(${s.colorVar})" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join("");

  const labelStep = Math.max(1, Math.ceil(pointCount / maxLabels));
  const xAxisLabels = xLabels
    .map((label, i) => {
      const isLast = i === pointCount - 1;
      if (i % labelStep !== 0 && !isLast) return "";
      return `<text x="${xAt(i).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11" style="fill:var(--color-text-muted)">${label}</text>`;
    })
    .join("");

  function highlightPoint(seriesIndex: number, pickMax: boolean, colorVar: string): string {
    const values = series[seriesIndex]?.values;
    if (!values || values.length === 0) return "";
    const target = pickMax ? Math.max(...values) : Math.min(...values);
    const idx = values.indexOf(target);
    const x = xAt(idx);
    const y = yAt(target);
    const axisTextTop = height - paddingBottom + 4; // where x-axis label text starts
    const labelY = pickMax ? Math.max(y - 10, paddingTop - 6) : Math.min(y + 14, axisTextTop - 8);
    return `
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="var(${colorVar})" stroke="#fff" stroke-width="1.5"/>
      <text x="${x.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" style="fill:var(${colorVar})">${Math.round(target)}${unit}</text>
    `;
  }

  const maxColorVar = series[maxOfIndex]?.colorVar ?? series[0].colorVar;
  const minColorVar = series[minOfIndex]?.colorVar ?? series[0].colorVar;

  const highlights = highlightPoint(maxOfIndex, true, maxColorVar) + highlightPoint(minOfIndex, false, minColorVar);

  return `<svg class="line-chart__svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    ${gridLines}
    ${lines}
    ${highlights}
    ${xAxisLabels}
  </svg>`;
}
