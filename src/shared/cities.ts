/**
 * Iran's 31 provincial capitals. Shared between server (needs lat/lon for
 * the hottest/coldest lookup, avoiding a geocode round-trip per city) and
 * client (renders these as quick-select cards).
 */

export type CityIconType = "capital" | "landmark" | "mountain" | "coastal" | "desert" | "skyline";

export interface CityEntry {
  name: string;
  province: string;
  lat: number;
  lon: number;
  icon: CityIconType;
}

export const CITIES: CityEntry[] = [
  { name: "تهران", province: "تهران", lat: 35.6944, lon: 51.4215, icon: "capital" },
  { name: "مشهد", province: "خراسان رضوی", lat: 36.2605, lon: 59.6168, icon: "landmark" },
  { name: "اصفهان", province: "اصفهان", lat: 32.6546, lon: 51.668, icon: "landmark" },
  { name: "شیراز", province: "فارس", lat: 29.5918, lon: 52.5837, icon: "landmark" },
  { name: "تبریز", province: "آذربایجان شرقی", lat: 38.08, lon: 46.2919, icon: "mountain" },
  { name: "اهواز", province: "خوزستان", lat: 31.3183, lon: 48.6706, icon: "coastal" },
  { name: "کرج", province: "البرز", lat: 35.84, lon: 50.9391, icon: "skyline" },
  { name: "قم", province: "قم", lat: 34.6416, lon: 50.8746, icon: "landmark" },
  { name: "کرمانشاه", province: "کرمانشاه", lat: 34.3142, lon: 47.065, icon: "mountain" },
  { name: "ارومیه", province: "آذربایجان غربی", lat: 37.5527, lon: 45.0761, icon: "mountain" },
  { name: "رشت", province: "گیلان", lat: 37.2809, lon: 49.5832, icon: "coastal" },
  { name: "زاهدان", province: "سیستان و بلوچستان", lat: 29.4963, lon: 60.8629, icon: "desert" },
  { name: "کرمان", province: "کرمان", lat: 30.2839, lon: 57.0834, icon: "desert" },
  { name: "یزد", province: "یزد", lat: 31.8974, lon: 54.3569, icon: "desert" },
  { name: "اردبیل", province: "اردبیل", lat: 38.2498, lon: 48.2933, icon: "mountain" },
  { name: "بندرعباس", province: "هرمزگان", lat: 27.1865, lon: 56.2808, icon: "coastal" },
  { name: "اراک", province: "مرکزی", lat: 34.0917, lon: 49.6892, icon: "skyline" },
  { name: "همدان", province: "همدان", lat: 34.7992, lon: 48.5146, icon: "landmark" },
  { name: "یاسوج", province: "کهگیلویه و بویراحمد", lat: 30.6682, lon: 51.588, icon: "mountain" },
  { name: "قزوین", province: "قزوین", lat: 36.2688, lon: 50.0041, icon: "landmark" },
  { name: "ساری", province: "مازندران", lat: 36.5633, lon: 53.0601, icon: "coastal" },
  { name: "بوشهر", province: "بوشهر", lat: 28.9234, lon: 50.8203, icon: "coastal" },
  { name: "سنندج", province: "کردستان", lat: 35.3144, lon: 46.9923, icon: "mountain" },
  { name: "زنجان", province: "زنجان", lat: 36.6764, lon: 48.4963, icon: "skyline" },
  { name: "شهرکرد", province: "چهارمحال و بختیاری", lat: 32.3256, lon: 50.8642, icon: "mountain" },
  { name: "خرم‌آباد", province: "لرستان", lat: 33.4878, lon: 48.3558, icon: "mountain" },
  { name: "ایلام", province: "ایلام", lat: 33.6374, lon: 46.4227, icon: "mountain" },
  { name: "بیرجند", province: "خراسان جنوبی", lat: 32.8663, lon: 59.2211, icon: "desert" },
  { name: "گرگان", province: "گلستان", lat: 36.8427, lon: 54.4392, icon: "coastal" },
  { name: "سمنان", province: "سمنان", lat: 35.5769, lon: 53.396, icon: "desert" },
  { name: "بجنورد", province: "خراسان شمالی", lat: 37.4747, lon: 57.329, icon: "mountain" },
];
