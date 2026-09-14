export interface AqiCategory {
  label: string;
  className: string;
}

export function classifyAqi(aqi: number): AqiCategory {
  if (aqi <= 50) return { label: "پاک و سالم", className: "aqi-card--good" };
  if (aqi <= 100) return { label: "قابل قبول", className: "aqi-card--moderate" };
  if (aqi <= 150) return { label: "ناسالم برای گروه‌های حساس", className: "aqi-card--sensitive" };
  if (aqi <= 200) return { label: "ناسالم", className: "aqi-card--unhealthy" };
  if (aqi <= 300) return { label: "بسیار ناسالم", className: "aqi-card--very-unhealthy" };
  return { label: "خطرناک", className: "aqi-card--hazardous" };
}
