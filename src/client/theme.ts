const STORAGE_KEY = "havache-theme";

type Theme = "light" | "dark";

function systemPrefersDark(): boolean {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function initTheme(): void {
  const saved = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  const theme: Theme = saved ?? (systemPrefersDark() ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}

export function toggleTheme(): void {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next: Theme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  window.localStorage.setItem(STORAGE_KEY, next);
}
