import { useSyncExternalStore } from "react";

const SERVER_NOW = new Date(0);

let now = SERVER_NOW;
let timeoutId: ReturnType<typeof setTimeout> | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;
const listeners = new Set<() => void>();

function syncNow() {
  const next = new Date();

  if (next.getTime() === now.getTime()) {
    return;
  }

  now = next;
  listeners.forEach((listener) => listener());
}

function msUntilNextSecond() {
  return 1000 - new Date().getMilliseconds();
}

function stopClock() {
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
    timeoutId = null;
  }

  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("focus", syncNow);
}

function handleVisibilityChange() {
  if (document.visibilityState === "visible") {
    syncNow();
  }
}

function startClock() {
  if (typeof window === "undefined") {
    return;
  }

  syncNow();

  timeoutId = setTimeout(() => {
    syncNow();
    intervalId = setInterval(syncNow, 1000);
  }, msUntilNextSecond());

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", syncNow);
}

function subscribe(listener: () => void) {
  const wasEmpty = listeners.size === 0;
  listeners.add(listener);

  if (wasEmpty) {
    startClock();
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0) {
      stopClock();
    }
  };
}

function getSnapshot(): Date {
  return now;
}

function getServerSnapshot(): Date {
  return SERVER_NOW;
}

export function useNow(): Date {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
