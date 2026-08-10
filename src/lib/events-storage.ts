import type { Event } from "@/types/event";

const STORAGE_KEY = "ourtz:events";

function isEvent(value: unknown): value is Event {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "title" in value &&
    "datetime" in value &&
    "timezone" in value &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.datetime === "string" &&
    typeof value.timezone === "string"
  );
}

function parseEvents(raw: string): Event[] {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isEvent);
  } catch {
    return [];
  }
}

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function getEvents(): Event[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return [];
  }

  return parseEvents(raw);
}

export function saveEvents(events: Event[]): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function addEvent(event: Omit<Event, "id">): Event {
  const newEvent: Event = {
    ...event,
    id: crypto.randomUUID(),
  };

  saveEvents([...getEvents(), newEvent]);

  return newEvent;
}

export function updateEvent(
  id: string,
  updates: Partial<Omit<Event, "id">>,
): Event | null {
  const events = getEvents();
  const index = events.findIndex((event) => event.id === id);

  if (index === -1) {
    return null;
  }

  const updatedEvent: Event = {
    ...events[index],
    ...updates,
  };

  const nextEvents = [...events];
  nextEvents[index] = updatedEvent;
  saveEvents(nextEvents);

  return updatedEvent;
}

export function deleteEvent(id: string): boolean {
  const events = getEvents();
  const nextEvents = events.filter((event) => event.id !== id);

  if (nextEvents.length === events.length) {
    return false;
  }

  saveEvents(nextEvents);

  return true;
}
