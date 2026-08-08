"use client";

import { useEffect } from "react";
import { usersApi } from "@/features/users/api/users-api";

export const HEARTBEAT_INTERVAL_MS = 60_000;

/**
 * Registers the signed-in user's presence on the site. Fires once on mount
 * and then every minute so the backend can report how many users are
 * currently online. Failures (e.g. expired token) are silently ignored.
 */
export function Heartbeat() {
  useEffect(() => {
    const beat = () => {
      void usersApi.heartbeat().catch(() => undefined);
    };

    beat();
    const id = setInterval(beat, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return null;
}
