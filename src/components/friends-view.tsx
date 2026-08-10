"use client";

import { useState } from "react";
import { AddFriendModal } from "@/components/add-friend-modal";
import { AppHeader } from "@/components/app-header";
import { LocalClock } from "@/components/local-clock";
import { refreshFriendsStore, useFriends } from "@/hooks/use-friends";
import { useNow } from "@/hooks/use-now";
import {
  addFriend,
  deleteFriend,
} from "@/lib/friends-storage";
import {
  formatDateInZone,
  formatTimeInZone,
  getTimeZoneLabel,
} from "@/lib/time";
import { getCityForTimezone } from "@/lib/timezone-options";
import type { Friend } from "@/types/friend";

export function FriendsView() {
  const friends = useFriends();
  const now = useNow();
  const [showAddModal, setShowAddModal] = useState(false);

  function handleAdd(name: string, timezone: string) {
    addFriend({ name, timezone });
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

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
              Friends
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
              Your people across time zones
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Add friend
          </button>
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-zinc-500">Your time</h2>
          <div className="mt-3 max-w-sm">
            <LocalClock />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-sm font-medium text-zinc-500">
            Friends ({friends.length})
          </h2>

          {friends.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
              <p className="text-zinc-600">No friends yet.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Add someone to see their local time here.
              </p>
            </div>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {friends.map((friend) => (
                <FriendCard
                  key={friend.id}
                  friend={friend}
                  now={now}
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
  onDelete,
}: {
  friend: Friend;
  now: Date;
  onDelete: () => void;
}) {
  const city = getCityForTimezone(friend.timezone);

  return (
    <li className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-zinc-900">
            {friend.name}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 tabular-nums">
            {formatTimeInZone(now, friend.timezone)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            {formatDateInZone(now, friend.timezone)}
          </p>

          <p className="mt-3 text-sm text-zinc-500">
            {city ? `${city} · ` : ""}
            {getTimeZoneLabel(friend.timezone)}
          </p>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="shrink-0 rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
