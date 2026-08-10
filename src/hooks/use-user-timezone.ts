import { useSyncExternalStore } from "react";
import { getUserTimezone } from "@/lib/user-timezone";

function subscribe() {
  return () => {};
}

export function useUserTimezone() {
  return useSyncExternalStore(
    subscribe,
    getUserTimezone,
    () => null,
  );
}
