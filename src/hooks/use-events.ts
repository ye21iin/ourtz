import { useSyncExternalStore } from "react";
import { getEvents } from "@/lib/events-storage";
import type { Event } from "@/types/event";

const EMPTY_EVENTS: Event[] = [];

let version = 0;
let cachedVersion = -1;
let cachedSnapshot: Event[] = EMPTY_EVENTS;
const listeners = new Set<() => void>();

export function refreshEventsStore() {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Event[] {
  if (cachedVersion === version) {
    return cachedSnapshot;
  }

  cachedVersion = version;
  const events = getEvents();
  cachedSnapshot = events.length === 0 ? EMPTY_EVENTS : events;

  return cachedSnapshot;
}

function getServerSnapshot(): Event[] {
  return EMPTY_EVENTS;
}

export function useEvents() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
