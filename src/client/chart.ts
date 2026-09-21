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
 * Builds a small, dependency-free line chart. The SVG only draws
 * geometry (gridlines, the line itself, and small dot markers) — every
 * label (x-axis days/times, the peak/trough values) is real HTML laid
 * on top at the same pixel coordinates, so text always renders in the
 * page's own font rather than whatever font an <svg><text> element falls
 * back to. Returns a ready-to-insert HTML string.
 */
export function buildLineChart(series: ChartSeries[], xLabels: string[], options: BuildChartOptions = {}): string {
  const height = options.height ?? 104;
  const unit = options.unit ?? "°";
  const maxLabels = options.maxLabels ?? Math.min(xLabels.length, 8);
  const maxOfIndex = options.maxOf ?? 0;
  const minOfIndex = options.minOf ?? 0;

  const pointCount = xLabels.length;
  if (pointCount === 0 || series.length === 0) return "";

  const width = Math.max(pointCount * 52, 280);
  const paddingX = 10;
  const paddingTop = 28; // room for a value label sitting above the point (e.g. the hottest day)
  const paddingBottom = 10; // dots only need a little clearance at the bottom
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

  function highlightDot(seriesIndex: number, pickMax: boolean, colorVar: string) {
    const values = series[seriesIndex]?.values;
    if (!values || values.length === 0) return { dot: "", label: "" };
    const target = pickMax ? Math.max(...values) : Math.min(...values);
    const idx = values.indexOf(target);
    const x = xAt(idx);
    const y = yAt(target);
    const xPercent = ((x / width) * 100).toFixed(2);
    const dot = `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="var(${colorVar})" stroke="#fff" stroke-width="1.5"/>`;
    const label = `<span class="chart-value-label" style="left:${xPercent}%;top:${y.toFixed(
      1
    )}px;color:var(${colorVar})">${Math.round(target)}${unit}</span>`;
    return { dot, label };
  }

  const maxColorVar = series[maxOfIndex]?.colorVar ?? series[0].colorVar;
  const minColorVar = series[minOfIndex]?.colorVar ?? series[0].colorVar;
  const maxHighlight = highlightDot(maxOfIndex, true, maxColorVar);
  const minHighlight = highlightDot(minOfIndex, false, minColorVar);

  const labelStep = Math.max(1, Math.ceil(pointCount / maxLabels));
  const axisLabels = xLabels
    .map((label, i) => {
      const isLast = i === pointCount - 1;
      if (i % labelStep !== 0 && !isLast) return "";
      const xPercent = ((xAt(i) / width) * 100).toFixed(2);
      return `<span class="chart-axis-label" style="left:${xPercent}%">${label}</span>`;
    })
    .join("");

  // width is the natural/minimum pixel width (enough room per point to stay
  // readable). CSS stretches these boxes to fill the container when it's
  // wider than that floor, and falls back to horizontal scroll (via the
  // parent .chart-container's overflow-x) only when it isn't. Label
  // positions are percentages so they track the stretch exactly.
  return `<div class="chart-plot" style="min-width:${width}px">
    <div class="chart-plot__svg-wrap" style="min-width:${width}px;height:${height}px">
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        ${gridLines}
        ${lines}
        ${maxHighlight.dot}
        ${minHighlight.dot}
      </svg>
      ${maxHighlight.label}
      ${minHighlight.label}
    </div>
    <div class="chart-axis-labels" style="min-width:${width}px">
      ${axisLabels}
    </div>
  </div>`;
}
