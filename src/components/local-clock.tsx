"use client";

import { useNow } from "@/hooks/use-now";
import { useUserTimezone } from "@/hooks/use-user-timezone";
import {
  formatDateInZone,
  formatTimeInZone,
  getTimeZoneLabel,
} from "@/lib/time";

export function LocalClock() {
  const now = useNow();
  const timeZone = useUserTimezone();

  if (!timeZone) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-10 text-center shadow-sm">
        <p className="text-sm text-zinc-500">Loading your local time…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-8 py-10 text-center shadow-sm">
      <p className="text-5xl font-semibold tracking-tight text-zinc-900 tabular-nums">
        {formatTimeInZone(now, timeZone)}
      </p>
      <p className="mt-2 text-sm text-zinc-500">
        {formatDateInZone(now, timeZone)}
      </p>
      <p className="mt-4 text-xs uppercase tracking-wide text-zinc-400">
        {getTimeZoneLabel(timeZone)}
      </p>
    </div>
  );
}
