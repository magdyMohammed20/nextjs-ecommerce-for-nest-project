"use client";

import { Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function OrdersComingSoon() {
  const { t } = useTranslation("dashboard");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("orders.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("orders.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            {t("orders.comingSoonTitle")}
          </CardTitle>
          <CardDescription>{t("orders.comingSoonDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-medium">{t("orders.comingSoon")}</p>
              <p className="mt-2 text-sm text-muted-foreground max-w-md">
                {t("orders.comingSoonDetails")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}