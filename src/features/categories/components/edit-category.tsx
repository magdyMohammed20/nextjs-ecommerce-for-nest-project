"use client";

import { useTranslation } from "react-i18next";
import { useCategories } from "../hooks/use-categories";
import { CategoryForm } from "./category-form";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-states";

export function EditCategory({ categoryId }: { categoryId: number }) {
  const { t } = useTranslation("categoriesAdmin");
  const { data: allCategories, isLoading, isError, refetch } = useCategories();
  const category = allCategories?.find((c) => c.id === categoryId) ?? null;

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="rounded-xl border p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full py-10">
        <QueryErrorState
          title={t("toasts.failedToLoadCategories")}
          onRetry={refetch}
        />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        {t("categoryNotFound")}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("editTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("editSubtitle", { name: category.name })}
        </p>
      </div>
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
