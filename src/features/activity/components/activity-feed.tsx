"use client";

import { Package, ShoppingCart, Tags, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ActivitySummaryDto } from "../types/activity-types";
import { formatRelativeTime } from "../lib/relative-time";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type ActionPrefix = "user" | "product" | "category" | "order";

const ICON_BY_PREFIX: Record<ActionPrefix, LucideIcon> = {
  user: UserRound,
  product: Package,
  category: Tags,
  order: ShoppingCart,
};

const CHIP_CLASS_BY_PREFIX: Record<ActionPrefix, string> = {
  user: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  product: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  category: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  order: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};

function actionToTranslationKey(action: string): string {
  const [prefix, verb] = action.split(".");
  if (!prefix || !verb) return "actions.unknown";
  const verbKey = verb.replace(/(_\w)/g, (m) => m[1].toUpperCase());
  return `actions.${prefix}${verbKey.charAt(0).toUpperCase()}${verbKey.slice(1)}`;
}

function activityPrefix(action: string): ActionPrefix {
  const prefix = action.split(".")[0];
  return (
    prefix === "user" ||
    prefix === "product" ||
    prefix === "category" ||
    prefix === "order"
      ? prefix
      : "user"
  );
}

export function ActivityFeed({
  items,
  isLoading,
  hasError,
}: {
  items: ActivitySummaryDto[];
  isLoading: boolean;
  hasError: boolean;
}) {
  const { t } = useTranslation("activity");

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">
          {t("failedToLoad")}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <UserRound className="h-5 w-5 text-muted-foreground" />
        </span>
        <p className="text-sm font-medium text-muted-foreground">
          {t("noActivity")}
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {items.map((entry) => {
        const prefix = activityPrefix(entry.action);
        const Icon = ICON_BY_PREFIX[prefix];
        return (
          <li key={entry.id} className="flex items-center gap-3 py-2.5">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                CHIP_CLASS_BY_PREFIX[prefix],
              )}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                {entry.actorName ? (
                  <>
                    <span className="font-medium">{entry.actorName}</span>{" "}
                    {t(actionToTranslationKey(entry.action))}
                  </>
                ) : (
                  t(actionToTranslationKey(entry.action))
                )}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatRelativeTime(entry.createdAt, t)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
