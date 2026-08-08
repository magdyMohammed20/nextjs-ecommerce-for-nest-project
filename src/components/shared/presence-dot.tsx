"use client";

import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Matches the backend ONLINE_WINDOW_MS in stats.service.ts. */
export const ONLINE_WINDOW_MS = 3 * 60 * 1000;

export function isUserOnline(
  isOnline?: boolean,
  lastActiveAt?: string | null,
): boolean {
  if (!isOnline) return false;
  if (!lastActiveAt) return false;
  const seen = new Date(lastActiveAt).getTime();
  if (Number.isNaN(seen)) return false;
  // Fallback: a tab closed without signing out leaves isOnline true, so the
  // activity window still expires the dot.
  return Date.now() - seen < ONLINE_WINDOW_MS;
}

/**
 * Pulsing green dot when the user is currently online, muted gray dot
 * otherwise. Tooltip reveals Online / Offline.
 */
export function PresenceDot({
  isOnline,
  lastActiveAt,
}: {
  isOnline?: boolean;
  lastActiveAt?: string | null;
}) {
  const { t } = useTranslation("common");
  const online = isUserOnline(isOnline, lastActiveAt);
  const label = t(online ? "presence.online" : "presence.offline");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="img"
          aria-label={label}
          className="inline-flex h-2.5 w-2.5 shrink-0"
        >
          {online ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          ) : (
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
          )}
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
