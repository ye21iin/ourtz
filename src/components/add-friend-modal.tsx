"use client";

import { useMemo, useState } from "react";
import {
  filterTimezoneOptions,
  type TimezoneOption,
} from "@/lib/timezone-options";

type AddFriendModalProps = {
  onClose: () => void;
  onSave: (name: string, timezone: string) => void;
};

export function AddFriendModal({ onClose, onSave }: AddFriendModalProps) {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  const filteredOptions = useMemo(
    () => filterTimezoneOptions(search),
    [search],
  );

  const trimmedName = name.trim();
  const canSave = trimmedName.length > 0 && selectedTimezone !== null;

  function handleSave() {
    if (!canSave || !selectedTimezone) {
      return;
    }

    onSave(trimmedName, selectedTimezone);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className="absolute inset-0"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-friend-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
      >
        <div className="border-b border-zinc-200 px-6 py-5">
          <h2
            id="add-friend-title"
            className="text-lg font-semibold tracking-tight text-zinc-900"
          >
            Add friend
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Choose a city to set their timezone.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <label className="block">
            <span className="text-sm font-medium text-zinc-700">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Friend name"
              autoFocus
              className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-400"
            />
          </label>

          <div className="mt-6">
            <label className="block">
              <span className="text-sm font-medium text-zinc-700">
                Timezone
              </span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search cities"
                className="mt-2 w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-zinc-400"
              />
            </label>

            <ul className="mt-3 max-h-56 overflow-y-auto rounded-xl border border-zinc-200">
              {filteredOptions.length === 0 ? (
                <li className="px-4 py-6 text-center text-sm text-zinc-500">
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

        <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300"
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
        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors hover:bg-zinc-50 ${
          selected ? "bg-zinc-100" : ""
        }`}
      >
        <span className="font-medium text-zinc-900">{option.city}</span>
        <span className="text-zinc-500">{option.timezone.replace(/_/g, " ")}</span>
      </button>
    </li>
  );
}
