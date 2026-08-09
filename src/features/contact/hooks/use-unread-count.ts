"use client";

import { useSyncExternalStore } from "react";
import { contactApi } from "../api/contact-api";

const POLL_INTERVAL_MS = 30_000;

type UnreadUpdater = (prev: number) => number;

/**
 * Shared unread contact-message count backed by a module-level store so every
 * consumer (sidebar badge, bell icon, inbox) stays in sync instantly instead of
 * holding its own copy. Polls the backend every 30s, pauses while the tab is
 * hidden, never lets requests overlap, and runs a single poller for the whole
 * app (starts with the first subscriber, stops when the last one leaves).
 */
let unread = 0;
let inFlight = false;
let pollTimer: number | null = null;
let subscriberCount = 0;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function setUnread(value: number | UnreadUpdater) {
  const next =
    typeof value === "function" ? (value as UnreadUpdater)(unread) : value;
  unread = Math.max(0, Math.floor(next));
  emit();
}

function refresh() {
  if (inFlight) return;
  inFlight = true;
  contactApi
    .unreadCount()
    .then((res) => {
      setUnread(res.unread);
    })
    .catch(() => {
      // Silent — a transient failure shouldn't blow up the header.
    })
    .finally(() => {
      inFlight = false;
    });
}

function onVisibility() {
  if (document.visibilityState === "visible") refresh();
}

function startPolling() {
  refresh();
  pollTimer = window.setInterval(() => {
    if (document.visibilityState === "hidden") return;
    refresh();
  }, POLL_INTERVAL_MS);
  document.addEventListener("visibilitychange", onVisibility);
}

function stopPolling() {
  if (pollTimer) {
    window.clearInterval(pollTimer);
    pollTimer = null;
  }
  document.removeEventListener("visibilitychange", onVisibility);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  subscriberCount += 1;
  if (subscriberCount === 1 && typeof window !== "undefined") startPolling();
  return () => {
    listeners.delete(listener);
    subscriberCount -= 1;
    if (subscriberCount === 0) stopPolling();
  };
}

function getSnapshot() {
  return unread;
}

export function useUnreadCount() {
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { unread: value, refresh, setUnread };
}
