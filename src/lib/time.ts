import { formatInTimeZone, fromZonedTime, getTimezoneOffset } from "date-fns-tz";

export function formatTimeInZone(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, "HH:mm");
}

export function formatDateInZone(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, "EEE, MMM d");
}

export function getTimeZoneLabel(timeZone: string): string {
  return timeZone.replace(/_/g, " ");
}

export function getEventInstant(datetime: string, timezone: string): Date {
  return fromZonedTime(datetime, timezone);
}

export function formatEventDateTime(date: Date, timezone: string): string {
  return formatInTimeZone(date, timezone, "MMM d · h:mm a");
}

function getDateKeyInZone(date: Date, timeZone: string): string {
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd");
}

function getCalendarDayDiff(
  friendDateKey: string,
  userDateKey: string,
): number {
  const [userYear, userMonth, userDay] = userDateKey.split("-").map(Number);
  const [friendYear, friendMonth, friendDay] = friendDateKey
    .split("-")
    .map(Number);

  const userUtcDay = Date.UTC(userYear, userMonth - 1, userDay);
  const friendUtcDay = Date.UTC(friendYear, friendMonth - 1, friendDay);

  return Math.round((friendUtcDay - userUtcDay) / 86_400_000);
}

export function getRelativeDateLabel(
  now: Date,
  friendTimezone: string,
  userTimezone: string,
): "Tomorrow" | "Yesterday" | null {
  const userDateKey = getDateKeyInZone(now, userTimezone);
  const friendDateKey = getDateKeyInZone(now, friendTimezone);
  const dayDiff = getCalendarDayDiff(friendDateKey, userDateKey);

  if (dayDiff === 1) {
    return "Tomorrow";
  }

  if (dayDiff === -1) {
    return "Yesterday";
  }

  return null;
}

export function formatTimeDifference(
  now: Date,
  userTimezone: string,
  friendTimezone: string,
): string | null {
  if (userTimezone === friendTimezone) {
    return null;
  }

  const diffMinutes = Math.round(
    (getTimezoneOffset(friendTimezone, now) -
      getTimezoneOffset(userTimezone, now)) /
      60_000,
  );

  if (diffMinutes === 0) {
    return null;
  }

  const sign = diffMinutes > 0 ? "+" : "-";
  const absMinutes = Math.abs(diffMinutes);
  const hours = Math.floor(absMinutes / 60);
  const minutes = absMinutes % 60;

  if (hours === 0) {
    return `${sign}${minutes}m`;
  }

  if (minutes === 0) {
    return `${sign}${hours}h`;
  }

  return `${sign}${hours}h ${minutes}m`;
}

export type FriendTimeDisplay = {
  time: string;
  date: string;
  relativeDateLabel: "Tomorrow" | "Yesterday" | null;
  timeDifference: string | null;
};

export function getFriendTimeDisplay(
  now: Date,
  friendTimezone: string,
  userTimezone: string | null,
): FriendTimeDisplay {
  const time = formatTimeInZone(now, friendTimezone);
  const date = formatDateInZone(now, friendTimezone);

  if (!userTimezone) {
    return {
      time,
      date,
      relativeDateLabel: null,
      timeDifference: null,
    };
  }

  return {
    time,
    date,
    relativeDateLabel: getRelativeDateLabel(now, friendTimezone, userTimezone),
    timeDifference: formatTimeDifference(now, userTimezone, friendTimezone),
  };
}

export type EventTimeDisplay = {
  originalDateTime: string;
  localDateTime: string | null;
  localDateOffsetLabel: "Next day" | "Previous day" | null;
};

export function getEventTimeDisplay(
  datetime: string,
  eventTimezone: string,
  userTimezone: string | null,
): EventTimeDisplay {
  const instant = getEventInstant(datetime, eventTimezone);
  const originalDateTime = formatEventDateTime(instant, eventTimezone);

  if (!userTimezone) {
    return {
      originalDateTime,
      localDateTime: null,
      localDateOffsetLabel: null,
    };
  }

  const originalDateKey = getDateKeyInZone(instant, eventTimezone);
  const localDateKey = getDateKeyInZone(instant, userTimezone);
  const dayDiff = getCalendarDayDiff(localDateKey, originalDateKey);

  let localDateOffsetLabel: EventTimeDisplay["localDateOffsetLabel"] = null;

  if (dayDiff === 1) {
    localDateOffsetLabel = "Next day";
  } else if (dayDiff === -1) {
    localDateOffsetLabel = "Previous day";
  }

  return {
    originalDateTime,
    localDateTime: formatEventDateTime(instant, userTimezone),
    localDateOffsetLabel,
  };
}
