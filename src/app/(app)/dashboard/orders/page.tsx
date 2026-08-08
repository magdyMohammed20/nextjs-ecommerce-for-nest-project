"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { OrdersTable } from "@/features/orders/components/orders-table";
import { OrderStatsCards } from "@/features/orders/components/order-stats-cards";

export default function OrdersPage() {
  const { t } = useTranslation("orders");
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  return (
    <RequireRole role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <OrderStatsCards refreshKey={statsRefreshKey} />
        <OrdersTable onStatusChange={() => setStatsRefreshKey((k) => k + 1)} />
      </div>
    </RequireRole>
  );
}
