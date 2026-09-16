/**
 * WMO Weather interpretation codes, as used by Open-Meteo.
 * Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes table)
 */

export type IconKey =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunderstorm";

/** Coarse grouping used to theme/animate a whole card (daily row, hero, etc.) */
export type Category = "sunny" | "cloudy" | "fog" | "rain" | "snow" | "storm";

export interface WeatherCodeInfo {
  label: string;
  icon: IconKey;
  category: Category;
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: "صاف", icon: "clear", category: "sunny" },
  1: { label: "عمدتاً صاف", icon: "partly-cloudy", category: "sunny" },
  2: { label: "نیمه‌ابری", icon: "partly-cloudy", category: "cloudy" },
  3: { label: "ابری", icon: "cloudy", category: "cloudy" },
  45: { label: "مه", icon: "fog", category: "fog" },
  48: { label: "مه یخ‌زده", icon: "fog", category: "fog" },
  51: { label: "نم‌نم باران سبک", icon: "drizzle", category: "rain" },
  53: { label: "نم‌نم باران متوسط", icon: "drizzle", category: "rain" },
  55: { label: "نم‌نم باران شدید", icon: "drizzle", category: "rain" },
  56: { label: "نم‌نم باران یخ‌زده سبک", icon: "drizzle", category: "rain" },
  57: { label: "نم‌نم باران یخ‌زده شدید", icon: "drizzle", category: "rain" },
  61: { label: "باران سبک", icon: "rain", category: "rain" },
  63: { label: "باران متوسط", icon: "rain", category: "rain" },
  65: { label: "باران شدید", icon: "rain", category: "rain" },
  66: { label: "باران یخ‌زده سبک", icon: "rain", category: "rain" },
  67: { label: "باران یخ‌زده شدید", icon: "rain", category: "rain" },
  71: { label: "برف سبک", icon: "snow", category: "snow" },
  73: { label: "برف متوسط", icon: "snow", category: "snow" },
  75: { label: "برف شدید", icon: "snow", category: "snow" },
  77: { label: "دانه‌های برف", icon: "snow", category: "snow" },
  80: { label: "رگبار سبک", icon: "showers", category: "rain" },
  81: { label: "رگبار متوسط", icon: "showers", category: "rain" },
  82: { label: "رگبار شدید", icon: "showers", category: "rain" },
  85: { label: "رگبار برف سبک", icon: "snow", category: "snow" },
  86: { label: "رگبار برف شدید", icon: "snow", category: "snow" },
  95: { label: "رعدوبرق", icon: "thunderstorm", category: "storm" },
  96: { label: "رعدوبرق با تگرگ سبک", icon: "thunderstorm", category: "storm" },
  99: { label: "رعدوبرق با تگرگ شدید", icon: "thunderstorm", category: "storm" },
};

export function describeWeatherCode(code: number): WeatherCodeInfo {
  return WEATHER_CODE_MAP[code] ?? { label: "نامشخص", icon: "cloudy", category: "cloudy" };
}

/** Compass direction abbreviation in Persian for a wind-direction degree value. */
export function windDirectionLabel(deg: number): string {
  const directions = [
    "شمال",
    "شمال‌شرق",
    "شرق",
    "جنوب‌شرق",
    "جنوب",
    "جنوب‌غرب",
    "غرب",
    "شمال‌غرب",
  ];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

/** A short, plain-language tip for the general public based on current conditions. */
export function conditionTip(params: { category: Category; temperature: number; windSpeed: number }): string {
  const { category, temperature, windSpeed } = params;

  if (category === "storm") return "بهتر است این ساعت‌ها بیرون از خانه نمانید.";
  if (category === "snow") return "از بارش برف لذت ببر!";
  if (category === "rain") return "امروز بارون می‌باره، چتر داشته باش.";
  if (category === "fog") return "دید کم است، در رانندگی احتیاط کنید.";
  if (windSpeed >= 40) return "باد نسبتاً شدید است، مراقب اشیای سبک باشید.";

  if (temperature > 40) return "خیلی گرمه، مراقب خودت باش.";
  if (temperature > 30) return "تابش آفتاب شدید است، از کرم ضدآفتاب استفاده کنید.";
  if (temperature < 20) return "مراقب باش سرما نخوری.";
  return "هوا خوبه، لذت ببرید.";
}
