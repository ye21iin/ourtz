export type TimezoneOption = {
  city: string;
  timezone: string;
};

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { city: "Vancouver", timezone: "America/Vancouver" },
  { city: "Los Angeles", timezone: "America/Los_Angeles" },
  { city: "Denver", timezone: "America/Denver" },
  { city: "Chicago", timezone: "America/Chicago" },
  { city: "New York", timezone: "America/New_York" },
  { city: "Toronto", timezone: "America/Toronto" },
  { city: "Mexico City", timezone: "America/Mexico_City" },
  { city: "São Paulo", timezone: "America/Sao_Paulo" },
  { city: "London", timezone: "Europe/London" },
  { city: "Paris", timezone: "Europe/Paris" },
  { city: "Berlin", timezone: "Europe/Berlin" },
  { city: "Amsterdam", timezone: "Europe/Amsterdam" },
  { city: "Istanbul", timezone: "Europe/Istanbul" },
  { city: "Dubai", timezone: "Asia/Dubai" },
  { city: "Mumbai", timezone: "Asia/Kolkata" },
  { city: "Bangkok", timezone: "Asia/Bangkok" },
  { city: "Singapore", timezone: "Asia/Singapore" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong" },
  { city: "Seoul", timezone: "Asia/Seoul" },
  { city: "Tokyo", timezone: "Asia/Tokyo" },
  { city: "Sydney", timezone: "Australia/Sydney" },
  { city: "Auckland", timezone: "Pacific/Auckland" },
];

export function filterTimezoneOptions(query: string): TimezoneOption[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return TIMEZONE_OPTIONS;
  }

  return TIMEZONE_OPTIONS.filter(
    (option) =>
      option.city.toLowerCase().includes(normalized) ||
      option.timezone.toLowerCase().includes(normalized),
  );
}

export function getCityForTimezone(timezone: string): string | null {
  const match = TIMEZONE_OPTIONS.find((option) => option.timezone === timezone);

  return match?.city ?? null;
}

export function getCityDisplayName(timezone: string): string {
  const city = getCityForTimezone(timezone);

  if (city) {
    return city;
  }

  const fallback = timezone.split("/").pop();

  return fallback ? fallback.replace(/_/g, " ") : timezone;
}
