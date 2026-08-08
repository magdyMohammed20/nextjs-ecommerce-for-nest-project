"use client";

import { PackagePlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProductForm } from "@/features/products/components/product-form";

export default function SubmitProductPage() {
  const { t } = useTranslation("productForm");

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <PackagePlus className="h-6 w-6 text-primary" />
          {t("submitTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("submitSubtitle")}
        </p>
      </div>
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <ProductForm mode="submit" />
      </div>
    </div>
  );
}
