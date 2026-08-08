"use client";

import { useEffect, useState } from "react";
import { Package, Scale } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { activityApi } from "@/features/activity/api/activity-api";
import type { ActivitySummaryDto } from "@/features/activity/types/activity-types";
import { formatRelativeTime } from "@/features/activity/lib/relative-time";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const FETCH_LIMIT = 40;
const DISPLAY_LIMIT = 8;

/**
 * Compact audit trail of who approved/rejected product submissions and when.
 * Powered by the shared activity feed, filtered to moderation decisions.
 */
export function SubmissionAuditFeed() {
  const { t } = useTranslation("activity");
  const { t: tDashboard } = useTranslation("dashboard");

  const [items, setItems] = useState<ActivitySummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let ignore = false;
    activityApi
      .getLatest(FETCH_LIMIT)
      .then((entries) => {
        if (ignore) return;
        setItems(
          entries
            .filter(
              (entry) =>
                entry.targetType === "product" &&
                entry.action === "product.status_changed",
            )
            .slice(0, DISPLAY_LIMIT),
        );
      })
      .catch(() => {
        if (!ignore) {
          setHasError(true);
          toast.error(t("failedToLoad"));
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [t]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full" />
        ))}
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8 text-center">
        <Scale className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{t("failedToLoad")}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8 text-center">
        <Scale className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {tDashboard("submissions.audit.empty")}
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y">
      {items.map((entry) => (
        <li key={entry.id} className="flex items-center gap-3 py-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
            <Package className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn("truncate text-sm")}>
              {entry.actorName && (
                <span className="font-medium">{entry.actorName}</span>
              )}
              {entry.actorName ? " " : ""}
              <span className="text-muted-foreground">
                {t("actions.productStatusChanged")}
              </span>
            </p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(entry.createdAt, t)}
          </span>
        </li>
      ))}
    </ul>
  );
}
