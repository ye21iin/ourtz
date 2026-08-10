import { useSyncExternalStore } from "react";
import {
  applyTheme,
  getResolvedTheme,
  type Theme,
} from "@/lib/theme-storage";

function subscribe(listener: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onChange = () => {
    applyTheme(getResolvedTheme());
    listener();
  };

  window.addEventListener("ourtz:theme-change", onChange);
  window.addEventListener("storage", onChange);
  media.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("ourtz:theme-change", onChange);
    window.removeEventListener("storage", onChange);
    media.removeEventListener("change", onChange);
  };
}

function getSnapshot(): Theme {
  return getResolvedTheme();
}

function getServerSnapshot(): Theme {
  return "light";
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
