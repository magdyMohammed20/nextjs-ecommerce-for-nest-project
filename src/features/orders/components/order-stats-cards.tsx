"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Clock,
  PackageCheck,
  PackageX,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ordersApi } from "../api/orders-api";
import type { OrderAdminStats } from "../types/order-types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardBackdrop } from "@/components/shared/stat-card-backdrop";

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

type StatDef = {
  key: keyof OrderAdminStats;
  labelKey: string;
  icon: typeof ShoppingCart;
  isMoney: boolean;
};

const ICON_BADGE_CLASS = "bg-primary/10 text-primary";

const STATS: StatDef[] = [
  {
    key: "totalOrders",
    labelKey: "stats.totalOrders",
    icon: ShoppingCart,
    isMoney: false,
  },
  {
    key: "totalRevenue",
    labelKey: "stats.revenue",
    icon: CircleDollarSign,
    isMoney: true,
  },
  {
    key: "pending",
    labelKey: "statuses.pending",
    icon: Clock,
    isMoney: false,
  },
  {
    key: "confirmed",
    labelKey: "statuses.confirmed",
    icon: CheckCircle2,
    isMoney: false,
  },
  {
    key: "shipped",
    labelKey: "statuses.shipped",
    icon: Truck,
    isMoney: false,
  },
  {
    key: "delivered",
    labelKey: "statuses.delivered",
    icon: PackageCheck,
    isMoney: false,
  },
  {
    key: "cancelled",
    labelKey: "statuses.cancelled",
    icon: PackageX,
    isMoney: false,
  },
];

export function OrderStatsCards({ refreshKey = 0 }: { refreshKey?: number }) {
  const { t } = useTranslation("orders");
  const [stats, setStats] = useState<OrderAdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    ordersApi
      .getStats()
      .then((data) => {
        if (!ignore) setStats(data);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("toasts.failedToLoad"),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [refreshKey, t]);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {isLoading
        ? Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-[74px] w-full rounded-xl" />
          ))
        : STATS.map(({ key, labelKey, icon: Icon, isMoney }) => (
            <Card key={key} className="relative transition-shadow hover:shadow-md">
              <StatCardBackdrop />
              <CardContent className="flex items-center gap-3 p-4">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${ICON_BADGE_CLASS}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-2xl font-bold leading-none tracking-tight">
                    {isMoney
                      ? formatMoney(stats?.totalRevenue ?? 0)
                      : (stats?.[key] ?? 0)}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {t(labelKey)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
