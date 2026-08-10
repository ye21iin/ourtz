export function getUserTimezone(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
