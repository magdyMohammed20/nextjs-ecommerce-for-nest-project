"use client";

import { CheckCircle2, Clock, X, type LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProductStatus } from "@/features/products/types/product-types";

const statusStyles: Record<ProductStatus, string> = {
  pending:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  active:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  rejected: "border-destructive/40 bg-destructive/10 text-destructive",
};

const statusIcons: Record<ProductStatus, LucideIcon> = {
  pending: Clock,
  active: CheckCircle2,
  rejected: X,
};

export function ProductStatusBadge({
  status,
  iconOnly = false,
}: {
  status: ProductStatus;
  iconOnly?: boolean;
}) {
  const { t } = useTranslation("common");
  const StatusIcon = statusIcons[status];

  if (iconOnly) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={`inline-flex h-7 w-7 shrink-0 cursor-default items-center justify-center rounded-lg border ${statusStyles[status]}`}
          >
            <StatusIcon className="h-4 w-4" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">
          {t(`statuses.${status}`)}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Badge variant="outline" className={statusStyles[status]}>
      <StatusIcon className="mr-1 h-3 w-3 rtl:ml-1 rtl:mr-0" />
      {t(`statuses.${status}`)}
    </Badge>
  );
}
