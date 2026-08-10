import { formatInTimeZone } from "date-fns-tz";

export function formatTimeInZone(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, "HH:mm");
}

export function formatDateInZone(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, "EEE, MMM d");
}

export function getTimeZoneLabel(timeZone: string): string {
  return timeZone.replace(/_/g, " ");
}
