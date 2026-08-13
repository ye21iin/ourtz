"use client";

import { useMemo, useState } from "react";
import {
  filterTimezoneOptions,
  type TimezoneOption,
} from "@/lib/timezone-options";

type AddEventModalProps = {
  onClose: () => void;
  onSave: (input: {
    title: string;
    datetime: string;
    timezone: string;
  }) => void;
};

function getDefaultDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultTime(): string {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setMinutes(0, 0, 0);
  nextHour.setHours(now.getHours() + 1);
  const hours = String(nextHour.getHours()).padStart(2, "0");
  const minutes = String(nextHour.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function AddEventModal({ onClose, onSave }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(getDefaultDate);
  const [time, setTime] = useState(getDefaultTime);
  const [search, setSearch] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  const filteredOptions = useMemo(
    () => filterTimezoneOptions(search),
    [search],
  );

  const trimmedTitle = title.trim();
  const canSave =
    trimmedTitle.length > 0 &&
    date.length > 0 &&
    time.length > 0 &&
    selectedTimezone !== null;

  function handleSave() {
    if (!canSave || !selectedTimezone) {
      return;
    }

    onSave({
      title: trimmedTitle,
      datetime: `${date}T${time}`,
      timezone: selectedTimezone,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center dark:bg-black/60">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-event-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
          <h2
            id="add-event-title"
            className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            Add event
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Save a time in one city and see it in yours.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Title
            </span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Interview"
              autoFocus
              className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
            />
          </label>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Time
              </span>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-500"
              />
            </label>
          </div>

          <div className="mt-6">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Timezone
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search cities"
                className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
              />
            </label>

            <ul className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  No cities match your search.
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <TimezoneOptionRow
                    key={option.timezone}
                    option={option}
                    selected={selectedTimezone === option.timezone}
                    onSelect={() => setSelectedTimezone(option.timezone)}
                  />
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-6 py-5 sm:flex-row sm:justify-end dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function TimezoneOptionRow({
  option,
  selected,
  onSelect,
}: {
  option: TimezoneOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
          selected ? "bg-zinc-100 dark:bg-zinc-800" : ""
        }`}
      >
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {option.city}
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          {option.timezone.replace(/_/g, " ")}
        </span>
      </button>
    </li>
  );
}
