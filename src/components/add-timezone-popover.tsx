"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  filterTimezoneOptions,
  type TimezoneOption,
} from "@/lib/timezone-options";

type AddTimezonePopoverProps = {
  excludedTimezones: string[];
  onSelect: (option: TimezoneOption) => void;
  onClose: () => void;
};

export function AddTimezonePopover({
  excludedTimezones,
  onSelect,
  onClose,
}: AddTimezonePopoverProps) {
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const excluded = useMemo(
    () => new Set(excludedTimezones),
    [excludedTimezones],
  );

  const filteredOptions = useMemo(
    () =>
      filterTimezoneOptions(search).filter(
        (option) => !excluded.has(option.timezone),
      ),
    [excluded, search],
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 z-20 mt-2 w-64 max-w-[calc(100vw-3rem)] rounded-xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search cities"
        autoFocus
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500"
      />

      <ul className="mt-2 max-h-48 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <li className="px-3 py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            No cities match your search.
          </li>
        ) : (
          filteredOptions.map((option) => (
            <TimezoneOptionRow
              key={`${option.city}-${option.timezone}`}
              option={option}
              onSelect={() => onSelect(option)}
            />
          ))
        )}
      </ul>
    </div>
  );
}

function TimezoneOptionRow({
  option,
  onSelect,
}: {
  option: TimezoneOption;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
      >
        <span className="font-medium text-zinc-900 dark:text-zinc-50">
          {option.city}
        </span>
        <span className="ml-2 shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
          {option.timezone.split("/").pop()?.replace(/_/g, " ")}
        </span>
      </button>
    </li>
  );
}
