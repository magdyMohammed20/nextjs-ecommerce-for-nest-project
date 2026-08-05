"use client";

import { Suspense } from "react";
import { Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { ProductList } from "@/features/products/components/product-list";

function ProductsContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const categoriesParam = searchParams.get("categories");
  const categoryParam = searchParams.get("category");

  const initialCategoryIds = categoriesParam
    ? categoriesParam
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((id) => !Number.isNaN(id) && id > 0)
    : categoryParam && !Number.isNaN(Number(categoryParam))
      ? [Number(categoryParam)]
      : [];

  return (
    <ProductList
      key={`${search}:${initialCategoryIds.join(",")}`}
      initialSearch={search}
      initialCategoryIds={initialCategoryIds}
    />
  );
}

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
      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg border bg-muted/50" />
            ))}
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </div>
  );
}
