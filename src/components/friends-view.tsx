"use client";

import { useState } from "react";
import { AddFriendModal } from "@/components/add-friend-modal";
import { AppHeader } from "@/components/app-header";
import { LocalClock } from "@/components/local-clock";
import { refreshFriendsStore, useFriends } from "@/hooks/use-friends";
import { useNow } from "@/hooks/use-now";
import { useUserTimezone } from "@/hooks/use-user-timezone";
import {
  addFriend,
  deleteFriend,
} from "@/lib/friends-storage";
import { getFriendTimeDisplay } from "@/lib/time";
import type { Friend } from "@/types/friend";
import type { TimezoneOption } from "@/lib/timezone-options";

export function FriendsView() {
  const friends = useFriends();
  const now = useNow();
  const userTimezone = useUserTimezone();
  const [showAddModal, setShowAddModal] = useState(false);

  function handleAdd(name: string, option: TimezoneOption) {
    addFriend({ name, timezone: option.timezone, city: option.city });
    refreshFriendsStore();
    setShowAddModal(false);
  }

  function handleDelete(friend: Friend) {
    const confirmed = window.confirm(`Remove ${friend.name} from your friends?`);

    if (!confirmed) {
      return;
    }

    if (deleteFriend(friend.id)) {
      refreshFriendsStore();
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader active="friends" />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Friends
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Your people across time zones
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Add friend
          </button>
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Your time
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <LocalClock />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Friends ({friends.length})
          </h2>

          {friends.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-300">No friends yet.</p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Add someone to see their local time here.
              </p>
            </div>
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  now={now}
                  userTimezone={userTimezone}
                  onDelete={() => handleDelete(friend)}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      {showAddModal ? (
        <AddFriendModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      ) : null}
    </div>
  );
}

function FriendCard({
  friend,
  now,
  userTimezone,
  onDelete,
}: {
  friend: Friend;
  now: Date;
  userTimezone: string | null;
  onDelete: () => void;
}) {
  const city = friend.city;
  const display = getFriendTimeDisplay(now, friend.timezone, userTimezone);

  return (
    <li className="flex h-full flex-col rounded-2xl border border-zinc-200 bg-white px-5 py-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <p className="min-w-0 truncate text-base font-semibold text-zinc-900 dark:text-zinc-50">
          {friend.name}
        </p>

        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-red-900 dark:hover:bg-red-950 dark:hover:text-red-300"
        >
          Remove
        </button>
      </div>

      <p className="mt-4 text-5xl font-semibold leading-none tracking-tight text-zinc-900 tabular-nums sm:text-6xl dark:text-zinc-50">
        {display.time}
      </p>

      <p className="mt-3 text-base font-medium text-zinc-700 dark:text-zinc-300">
        {city}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
        {display.relativeDateLabel ? (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {display.relativeDateLabel}
          </span>
        ) : null}
        <span>{display.date}</span>
        {display.timeDifference ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{display.timeDifference}</span>
          </>
        ) : null}
      </div>
    </li>
  );
}
