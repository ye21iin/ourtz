"use client";

import { useNow } from "@/hooks/use-now";
import { useUserTimezone } from "@/hooks/use-user-timezone";
import { formatDateInZone, formatTimeInZone } from "@/lib/time";
import { getCityDisplayName } from "@/lib/timezone-options";

export function LocalClock() {
  const now = useNow();
  const timeZone = useUserTimezone();

  if (!timeZone) {
    return (
      <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white px-5 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Loading your local time…
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white px-5 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
        You
      </p>

      <p className="mt-4 text-5xl font-semibold leading-none tracking-tight text-zinc-900 tabular-nums sm:text-6xl dark:text-zinc-50">
        {formatTimeInZone(now, timeZone)}
      </p>

      <p className="mt-3 text-base font-medium text-zinc-700 dark:text-zinc-300">
        {getCityDisplayName(timeZone)}
      </p>

      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        {formatDateInZone(now, timeZone)}
      </p>
    </div>
  );
}
