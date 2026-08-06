"use client";

import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { ProductForm } from "@/features/products/components/product-form";
import { PackagePlus } from "lucide-react";

export default function NewProductPage() {
  const { t } = useTranslation("productForm");

  return (
    <RequireRole role="admin">
      <div className="w-full space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <PackagePlus className="h-6 w-6 text-primary" />
            {t("newTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("newSubtitle")}
          </p>
        </div>
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <ProductForm />
        </div>
      </div>
    </RequireRole>
  );
}
