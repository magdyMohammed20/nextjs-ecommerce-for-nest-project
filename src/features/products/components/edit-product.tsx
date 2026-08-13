"use client";

import { useTranslation } from "react-i18next";
import { useProduct } from "../hooks/use-products";
import { ProductForm } from "./product-form";
import { QueryErrorState } from "@/components/shared/query-states";
import { Skeleton } from "@/components/ui/skeleton";

export function EditProduct({ productId }: { productId: number }) {
  const { t } = useTranslation("productForm");
  const { data: product, isLoading, isError, refetch } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="rounded-xl border p-6">
          <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-10 w-40" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return isError ? (
      <div className="w-full py-10">
        <QueryErrorState
          title={t("toasts.failedToLoadProduct", { ns: "common" })}
          onRetry={refetch}
        />
      </div>
    ) : (
      <div className="py-20 text-center text-sm text-muted-foreground">
        {t("productNotFound")}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("editTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("editSubtitle", { name: product.name })}
        </p>
      </div>
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
