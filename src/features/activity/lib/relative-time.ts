import type { TFunction } from "i18next";

/** Relative timestamp label ("2h ago") using the `activity.time.*` keys. */
export function formatRelativeTime(date: string, t: TFunction): string {
  const then = new Date(date).getTime();
  if (Number.isNaN(then)) return "";

  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return t("time.justNow");

  const hours = Math.floor(minutes / 60);
  if (hours < 1) return t("time.minutesAgo", { count: minutes });

  const days = Math.floor(hours / 24);
  if (days < 1) return t("time.hoursAgo", { count: hours });

  const weeks = Math.floor(days / 7);
  if (weeks < 1) return t("time.daysAgo", { count: days });

  return t("time.weeksAgo", { count: weeks });
}
