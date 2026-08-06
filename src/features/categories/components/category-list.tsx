"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Hash, Pencil, Tags, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { categoriesApi } from "../api/categories-api";
import type { Category } from "../types/category-types";
import type { PaginationMeta } from "@/lib/pagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];
const DEFAULT_LIMIT = 10;

export function CategoryList() {
  const { t } = useTranslation("categoriesAdmin");
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    categoriesApi
      .getAllPage({ page, limit, search })
      .then((res) => {
        if (!ignore) {
          setCategories(res.data);
          setMeta(res.meta);
        }
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
  }, [page, limit, search, refreshKey, t]);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    setIsLoading(true);
  }

  function handleSearchChange(nextSearch: string) {
    if (nextSearch === search) return;
    setSearch(nextSearch);
    setPage(1);
    setIsLoading(true);
  }

  function handleLimitChange(nextLimit: string) {
    const parsed = Number(nextLimit);
    if (parsed === limit) return;
    setLimit(parsed);
    setPage(1);
    setIsLoading(true);
  }

  async function handleDelete() {
    if (!categoryToDelete) return;
    setIsDeleting(true);
    try {
      await categoriesApi.remove(categoryToDelete.id);
      const lastItemOnPage = categories.length === 1 && meta.page > 1;
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      if (lastItemOnPage) {
        setPage(meta.page - 1);
      } else {
        setRefreshKey((key) => key + 1);
      }
      toast.success(t("toasts.categoryDeleted"));
      setCategoryToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.failedToDeleteCategory"),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          onSearch={handleSearchChange}
          placeholder={t("searchPlaceholder")}
          className="w-full sm:w-64"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("show")}</span>
          <Select value={String(limit)} onValueChange={handleLimitChange}>
            <SelectTrigger size="sm" className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">{t("perPage")}</span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <Tags className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {search ? t("emptySearch") : t("empty")}
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("table.name")}</TableHead>
                <TableHead>{t("table.slug")}</TableHead>
                <TableHead>{t("table.sortOrder")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {category.slug}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Hash className="h-3.5 w-3.5" />
                      {category.sortOrder}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/categories/${category.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setCategoryToDelete(category)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
        onPageChange={handlePageChange}
      />

      <AlertDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { name: categoryToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("actions.cancel", { ns: "common" })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? t("actions.deleting", { ns: "common" }) : t("actions.delete", { ns: "common" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
