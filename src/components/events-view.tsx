"use client";

import { useState } from "react";
import { AddEventModal } from "@/components/add-event-modal";
import { AddTimezonePopover } from "@/components/add-timezone-popover";
import { AppHeader } from "@/components/app-header";
import { refreshEventsStore, useEvents } from "@/hooks/use-events";
import { useUserTimezone } from "@/hooks/use-user-timezone";
import { addEvent, deleteEvent, updateEvent } from "@/lib/events-storage";
import { getConvertedEventTime, getEventTimeDisplay } from "@/lib/time";
import {
  getCityDisplayName,
  type TimezoneOption,
} from "@/lib/timezone-options";
import type { ComparisonTimezone, Event } from "@/types/event";

export function EventsView() {
  const events = useEvents();
  const userTimezone = useUserTimezone();
  const [showAddModal, setShowAddModal] = useState(false);

  function handleAdd(input: {
    title: string;
    datetime: string;
    timezone: string;
    city: string;
    comparisonTimezones: ComparisonTimezone[];
  }) {
    addEvent(input);
    refreshEventsStore();
    setShowAddModal(false);
  }

  function handleDelete(event: Event) {
    const confirmed = window.confirm(`Remove “${event.title}” from your events?`);

    if (!confirmed) {
      return;
    }

    if (deleteEvent(event.id)) {
      refreshEventsStore();
    }
  }

  function handleAddComparisonTimezone(
    event: Event,
    option: TimezoneOption,
  ) {
    if (
      option.timezone === event.timezone ||
      option.timezone === userTimezone ||
      event.comparisonTimezones.some(
        (item) => item.timezone === option.timezone,
      )
    ) {
      return;
    }

    updateEvent(event.id, {
      comparisonTimezones: [
        ...event.comparisonTimezones,
        { city: option.city, timezone: option.timezone },
      ],
    });
    refreshEventsStore();
  }

  function handleRemoveComparisonTimezone(
    event: Event,
    comparison: ComparisonTimezone,
  ) {
    updateEvent(event.id, {
      comparisonTimezones: event.comparisonTimezones.filter(
        (item) =>
          !(
            item.city === comparison.city &&
            item.timezone === comparison.timezone
          ),
      ),
    });
    refreshEventsStore();
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader active="events" />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Events
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Events
            </h1>
            <p className="mt-2 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
              Convert and compare event times across time zones — save a time in
              one city and see the equivalent in yours.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + Add event
          </button>
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Saved ({events.length})
          </h2>

          {events.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-300">No events yet.</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Add an event in any city to see the equivalent time for you.
              </p>
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  userTimezone={userTimezone}
                  onDelete={() => handleDelete(event)}
                  onAddTimezone={(option) =>
                    handleAddComparisonTimezone(event, option)
                  }
                  onRemoveTimezone={(comparison) =>
                    handleRemoveComparisonTimezone(event, comparison)
                  }
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      {showAddModal ? (
        <AddEventModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      ) : null}
    </div>
  );
}

function EventCard({
  event,
  userTimezone,
  onDelete,
  onAddTimezone,
  onRemoveTimezone,
}: {
  event: Event;
  userTimezone: string | null;
  onDelete: () => void;
  onAddTimezone: (option: TimezoneOption) => void;
  onRemoveTimezone: (comparison: ComparisonTimezone) => void;
}) {
  const [showTimezonePicker, setShowTimezonePicker] = useState(false);
  const display = getEventTimeDisplay(
    event.datetime,
    event.timezone,
    userTimezone,
  );
  const excludedTimezones = [
    event.timezone,
    ...(userTimezone ? [userTimezone] : []),
    ...event.comparisonTimezones.map((item) => item.timezone),
  ];

  return (
    <li className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white px-5 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <p className="min-w-0 truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {event.title}
        </p>

        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-300"
        >
          Remove
        </button>
      </div>

      <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {event.city}
      </p>
      <p className="mt-1 text-lg font-medium text-zinc-900 dark:text-zinc-50">
        {display.originalDateTime}
      </p>
      <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
        {event.timezone}
      </p>

      {display.localDateTime && userTimezone ? (
        <div className="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Your time · {getCityDisplayName(userTimezone)}
          </p>
          <ConvertedTimeRow
            dateTime={display.localDateTime}
            dateOffsetLabel={display.localDateOffsetLabel}
          />
        </div>
      ) : null}

      {event.comparisonTimezones.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-4">
          {event.comparisonTimezones.map((comparison) => {
            const converted = getConvertedEventTime(
              event.datetime,
              event.timezone,
              comparison.timezone,
            );

            return (
              <li
                key={`${comparison.city}-${comparison.timezone}`}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {comparison.city}
                  </p>
                  <ConvertedTimeRow
                    dateTime={converted.dateTime}
                    dateOffsetLabel={converted.dateOffsetLabel}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveTimezone(comparison)}
                  aria-label={`Remove ${comparison.city}`}
                  className="shrink-0 rounded-full px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <div className="relative mt-4">
        <button
          type="button"
          onClick={() => setShowTimezonePicker((open) => !open)}
          className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          + Add timezone
        </button>

        {showTimezonePicker ? (
          <AddTimezonePopover
            excludedTimezones={excludedTimezones}
            onSelect={(option) => {
              onAddTimezone(option);
              setShowTimezonePicker(false);
            }}
            onClose={() => setShowTimezonePicker(false)}
          />
        ) : null}
      </div>
    </li>
  );
}

function ConvertedTimeRow({
  dateTime,
  dateOffsetLabel,
}: {
  dateTime: string;
  dateOffsetLabel: string | null;
}) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-2">
      {dateOffsetLabel ? (
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {dateOffsetLabel}
        </span>
      ) : null}
      <p className="text-base font-medium text-zinc-900 dark:text-zinc-50">
        {dateTime}
      </p>
    </div>
  );
}
