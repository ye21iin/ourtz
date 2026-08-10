export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "ourtz:theme";

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

export function getSystemTheme(): Theme {
  if (!canUseStorage()) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getStoredTheme(): Theme | null {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(raw) ? raw : null;
}

export function getResolvedTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme: Theme): void {
  if (!canUseStorage()) {
    return;
  }

  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  applyTheme(theme);
  window.dispatchEvent(new Event("ourtz:theme-change"));
}

export function toggleTheme(): Theme {
  const next = getResolvedTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/** Inline script for root layout — runs before paint to avoid a flash. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
