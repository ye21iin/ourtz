import type { Friend } from "@/types/friend";
import { getCityDisplayName } from "@/lib/timezone-options";

const STORAGE_KEY = "ourtz:friends";

function normalizeFriend(value: unknown): Friend | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  if (
    !("id" in value) ||
    !("name" in value) ||
    !("timezone" in value) ||
    typeof value.id !== "string" ||
    typeof value.name !== "string" ||
    typeof value.timezone !== "string"
  ) {
    return null;
  }

  const city =
    "city" in value && typeof value.city === "string" && value.city.length > 0
      ? value.city
      : getCityDisplayName(value.timezone);

  return {
    id: value.id,
    name: value.name,
    timezone: value.timezone,
    city,
  };
}

function parseFriends(raw: string): Friend[] {
  try {
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(normalizeFriend)
      .filter((friend): friend is Friend => friend !== null);
  } catch {
    return [];
  }
}

function canUseStorage(): boolean {
  return typeof window !== "undefined";
}

export function getFriends(): Friend[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (raw === null) {
    return [];
  }

  return parseFriends(raw);
}

export function saveFriends(friends: Friend[]): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(friends));
}

export function addFriend(friend: Omit<Friend, "id">): Friend {
  const newFriend: Friend = {
    ...friend,
    id: crypto.randomUUID(),
  };

  saveFriends([...getFriends(), newFriend]);

  return newFriend;
}

export function updateFriend(
  id: string,
  updates: Partial<Omit<Friend, "id">>,
): Friend | null {
  const friends = getFriends();
  const index = friends.findIndex((friend) => friend.id === id);

  if (index === -1) {
    return null;
  }

  const updatedFriend: Friend = {
    ...friends[index],
    ...updates,
  };

  const nextFriends = [...friends];
  nextFriends[index] = updatedFriend;
  saveFriends(nextFriends);

  return updatedFriend;
}

export function deleteFriend(id: string): boolean {
  const friends = getFriends();
  const nextFriends = friends.filter((friend) => friend.id !== id);

  if (nextFriends.length === friends.length) {
    return false;
  }

  saveFriends(nextFriends);

  return true;
}
