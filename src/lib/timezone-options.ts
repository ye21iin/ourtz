export type TimezoneOption = {
  city: string;
  timezone: string;
};

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { city: "Honolulu", timezone: "Pacific/Honolulu" },
  { city: "Anchorage", timezone: "America/Anchorage" },
  { city: "Vancouver", timezone: "America/Vancouver" },
  { city: "Seattle", timezone: "America/Los_Angeles" },
  { city: "Portland", timezone: "America/Los_Angeles" },
  { city: "San Francisco", timezone: "America/Los_Angeles" },
  { city: "Los Angeles", timezone: "America/Los_Angeles" },
  { city: "San Diego", timezone: "America/Los_Angeles" },
  { city: "Phoenix", timezone: "America/Phoenix" },
  { city: "Denver", timezone: "America/Denver" },
  { city: "Calgary", timezone: "America/Edmonton" },
  { city: "Chicago", timezone: "America/Chicago" },
  { city: "Houston", timezone: "America/Chicago" },
  { city: "Dallas", timezone: "America/Chicago" },
  { city: "Mexico City", timezone: "America/Mexico_City" },
  { city: "New York", timezone: "America/New_York" },
  { city: "Boston", timezone: "America/New_York" },
  { city: "Washington, DC", timezone: "America/New_York" },
  { city: "Miami", timezone: "America/New_York" },
  { city: "Toronto", timezone: "America/Toronto" },
  { city: "Montreal", timezone: "America/Toronto" },
  { city: "São Paulo", timezone: "America/Sao_Paulo" },
  { city: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires" },
  { city: "Reykjavik", timezone: "Atlantic/Reykjavik" },
  { city: "London", timezone: "Europe/London" },
  { city: "Dublin", timezone: "Europe/Dublin" },
  { city: "Lisbon", timezone: "Europe/Lisbon" },
  { city: "Paris", timezone: "Europe/Paris" },
  { city: "Madrid", timezone: "Europe/Madrid" },
  { city: "Barcelona", timezone: "Europe/Madrid" },
  { city: "Amsterdam", timezone: "Europe/Amsterdam" },
  { city: "Brussels", timezone: "Europe/Brussels" },
  { city: "Berlin", timezone: "Europe/Berlin" },
  { city: "Munich", timezone: "Europe/Berlin" },
  { city: "Rome", timezone: "Europe/Rome" },
  { city: "Zurich", timezone: "Europe/Zurich" },
  { city: "Stockholm", timezone: "Europe/Stockholm" },
  { city: "Oslo", timezone: "Europe/Oslo" },
  { city: "Copenhagen", timezone: "Europe/Copenhagen" },
  { city: "Warsaw", timezone: "Europe/Warsaw" },
  { city: "Athens", timezone: "Europe/Athens" },
  { city: "Helsinki", timezone: "Europe/Helsinki" },
  { city: "Istanbul", timezone: "Europe/Istanbul" },
  { city: "Cairo", timezone: "Africa/Cairo" },
  { city: "Johannesburg", timezone: "Africa/Johannesburg" },
  { city: "Nairobi", timezone: "Africa/Nairobi" },
  { city: "Dubai", timezone: "Asia/Dubai" },
  { city: "Moscow", timezone: "Europe/Moscow" },
  { city: "Tehran", timezone: "Asia/Tehran" },
  { city: "Karachi", timezone: "Asia/Karachi" },
  { city: "Mumbai", timezone: "Asia/Kolkata" },
  { city: "Delhi", timezone: "Asia/Kolkata" },
  { city: "Bengaluru", timezone: "Asia/Kolkata" },
  { city: "Colombo", timezone: "Asia/Colombo" },
  { city: "Dhaka", timezone: "Asia/Dhaka" },
  { city: "Bangkok", timezone: "Asia/Bangkok" },
  { city: "Ho Chi Minh City", timezone: "Asia/Ho_Chi_Minh" },
  { city: "Jakarta", timezone: "Asia/Jakarta" },
  { city: "Singapore", timezone: "Asia/Singapore" },
  { city: "Kuala Lumpur", timezone: "Asia/Kuala_Lumpur" },
  { city: "Manila", timezone: "Asia/Manila" },
  { city: "Hong Kong", timezone: "Asia/Hong_Kong" },
  { city: "Taipei", timezone: "Asia/Taipei" },
  { city: "Shanghai", timezone: "Asia/Shanghai" },
  { city: "Beijing", timezone: "Asia/Shanghai" },
  { city: "Seoul", timezone: "Asia/Seoul" },
  { city: "Busan", timezone: "Asia/Seoul" },
  { city: "Tokyo", timezone: "Asia/Tokyo" },
  { city: "Osaka", timezone: "Asia/Tokyo" },
  { city: "Kyoto", timezone: "Asia/Tokyo" },
  { city: "Kobe", timezone: "Asia/Tokyo" },
  { city: "Perth", timezone: "Australia/Perth" },
  { city: "Darwin", timezone: "Australia/Darwin" },
  { city: "Adelaide", timezone: "Australia/Adelaide" },
  { city: "Brisbane", timezone: "Australia/Brisbane" },
  { city: "Sydney", timezone: "Australia/Sydney" },
  { city: "Melbourne", timezone: "Australia/Melbourne" },
  { city: "Auckland", timezone: "Pacific/Auckland" },
  { city: "Wellington", timezone: "Pacific/Auckland" },
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
