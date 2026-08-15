import type { ComparisonTimezone, Event } from "@/types/event";
import { getCityDisplayName } from "@/lib/timezone-options";

const STORAGE_KEY = "ourtz:events";

function isComparisonTimezone(value: unknown): value is ComparisonTimezone {
  return (
    typeof value === "object" &&
    value !== null &&
    "city" in value &&
    "timezone" in value &&
    typeof value.city === "string" &&
    typeof value.timezone === "string"
  );
}

function normalizeComparisonTimezones(value: unknown): ComparisonTimezone[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return {
          city: getCityDisplayName(item),
          timezone: item,
        };
      }

      if (isComparisonTimezone(item)) {
        return item;
      }

      return null;
    })
    .filter((item): item is ComparisonTimezone => item !== null);
}

function normalizeEvent(value: unknown): Event | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  if (
    !("id" in value) ||
    !("title" in value) ||
    !("datetime" in value) ||
    !("timezone" in value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.datetime !== "string" ||
    typeof value.timezone !== "string"
  ) {
    return null;
  }

  const city =
    "city" in value && typeof value.city === "string" && value.city.length > 0
      ? value.city
      : getCityDisplayName(value.timezone);

  return {
    id: value.id,
    title: value.title,
    datetime: value.datetime,
    timezone: value.timezone,
    city,
    comparisonTimezones: normalizeComparisonTimezones(
      "comparisonTimezones" in value ? value.comparisonTimezones : [],
    ),
  };
}

function parseEvents(raw: string): Event[] {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeEvent)
      .filter((event): event is Event => event !== null);
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
    comparisonTimezones: event.comparisonTimezones ?? [],
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
