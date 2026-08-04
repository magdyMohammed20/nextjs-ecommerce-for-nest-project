"use client";

import { ShieldX } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AccessDenied() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4">
        <ShieldX className="h-10 w-10 text-destructive" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{t("accessDenied.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("accessDenied.description")}
        </p>
      </div>
    </div>
  );
}
