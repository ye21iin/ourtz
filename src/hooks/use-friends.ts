import { useSyncExternalStore } from "react";
import { getFriends } from "@/lib/friends-storage";
import type { Friend } from "@/types/friend";

const EMPTY_FRIENDS: Friend[] = [];

let version = 0;
let cachedVersion = -1;
let cachedSnapshot: Friend[] = EMPTY_FRIENDS;
const listeners = new Set<() => void>();

export function refreshFriendsStore() {
  version += 1;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Friend[] {
  if (cachedVersion === version) {
    return cachedSnapshot;
  }

  cachedVersion = version;
  const friends = getFriends();
  cachedSnapshot = friends.length === 0 ? EMPTY_FRIENDS : friends;

  return cachedSnapshot;
}

function getServerSnapshot(): Friend[] {
  return EMPTY_FRIENDS;
}

export function useFriends() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
