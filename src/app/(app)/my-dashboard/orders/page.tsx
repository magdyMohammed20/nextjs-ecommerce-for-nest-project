"use client";

import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { MyOrdersList } from "@/features/orders/components/my-orders-list";

export default function MyOrdersPage() {
  const { t } = useTranslation("orders");

  return (
    <RequireRole role="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("mine.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("mine.subtitle")}</p>
        </div>
        <MyOrdersList />
      </div>
    </RequireRole>
  );
}
