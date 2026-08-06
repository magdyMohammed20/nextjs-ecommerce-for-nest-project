"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { categoriesApi } from "../api/categories-api";
import { CategoryForm } from "./category-form";
import type { Category } from "../types/category-types";
import { Skeleton } from "@/components/ui/skeleton";

export function EditCategory({ categoryId }: { categoryId: number }) {
  const { t } = useTranslation("categoriesAdmin");
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    categoriesApi
      .getAll()
      .then((all) => {
        if (!ignore) setCategory(all.find((c) => c.id === categoryId) ?? null);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("toasts.failedToLoadCategories"),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [categoryId, t]);

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
