"use client";

import Link from "next/link";
import { Plus, Tags } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { CategoryList } from "@/features/categories/components/category-list";
import { Button } from "@/components/ui/button";

export default function CategoriesPage() {
  const { t } = useTranslation("categoriesAdmin");

  return (
    <RequireRole role="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Tags className="h-6 w-6 text-primary" />
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("addCategory")}
            </Link>
          </Button>
        </div>
        <CategoryList />
      </div>
    </RequireRole>
  );
}
