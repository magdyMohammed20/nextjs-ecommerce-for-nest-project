"use client";

import {
  CheckCircle2,
  Clock,
  PackageCheck,
  Truck,
  X,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { OrderStatus } from "../types/order-types";

const statusStyles: Record<OrderStatus, string> = {
  pending:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  confirmed:
    "border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  shipped:
    "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
  delivered:
    "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
};

const statusIcons: Record<OrderStatus, LucideIcon> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Truck,
  delivered: PackageCheck,
  cancelled: X,
};

export function OrderStatusBadge({
  status,
  iconOnly = false,
}: {
  status: OrderStatus;
  iconOnly?: boolean;
}) {
  const { t } = useTranslation("orders");
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
