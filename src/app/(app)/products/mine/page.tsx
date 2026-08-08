"use client";

import { PackageCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MySubmissionsList } from "@/features/products/components/my-submissions-list";

export default function MySubmissionsPage() {
  const { t } = useTranslation("products");

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <PackageCheck className="h-6 w-6 text-primary" />
          {t("mine.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("mine.subtitle")}
        </p>
      </div>
      <MySubmissionsList />
    </div>
  );
}
