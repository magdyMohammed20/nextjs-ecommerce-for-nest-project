"use client";

import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProductList } from "@/features/products/components/product-list";

export default function ProductsPage() {
  const { t } = useTranslation("products");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Package className="h-6 w-6 text-primary" />
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>
      <ProductList />
    </div>
  );
}
