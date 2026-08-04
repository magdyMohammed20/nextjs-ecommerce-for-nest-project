"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { productsApi } from "../api/products-api";
import type { Product } from "../types/product-types";
import type { PaginationMeta } from "@/lib/pagination";
import { useAuth } from "@/features/auth/context/auth-provider";
import { ProductCard } from "./product-card";
import { ProductImage } from "./product-image";
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

const PAGE_SIZE_OPTIONS = [6, 8, 10, 12, 16, 24];
const DEFAULT_LIMIT = 8;

export function ProductList() {
  const { isAdmin } = useAuth();
  const { t } = useTranslation("products");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    productsApi
      .getAll({ page, limit, search })
      .then((res) => {
        if (!ignore) {
          setProducts(res.data);
          setMeta(res.meta);
        }
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error
              ? error.message
              : t("toasts.failedToLoadProducts", { ns: "common" }),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, limit, search, t]);

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
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productsApi.remove(productToDelete.id);
      const lastItemOnPage = products?.length === 1 && meta.page > 1;
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      if (lastItemOnPage) {
        setPage(meta.page - 1);
      }
      toast.success(t("toasts.productDeleted", { ns: "common" }));
      setProductToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.failedToDeleteProduct", { ns: "common" }),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="flex items-center justify-end">
          <Button asChild>
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("newProduct")}
            </Link>
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          onSearch={handleSearchChange}
          placeholder={t("searchPlaceholder")}
          className="w-full sm:w-72"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("show")}</span>
          <Select value={String(limit)} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-20">
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
        isAdmin ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        )
      ) : products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          {isAdmin && (
            <Button asChild size="sm" variant="outline">
              <Link href="/products/new">{t("createFirst")}</Link>
            </Button>
          )}
        </div>
      ) : isAdmin ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("table.product")}</TableHead>
                <TableHead>{t("table.price")}</TableHead>
                <TableHead>{t("table.quantity")}</TableHead>
                <TableHead>{t("table.description")}</TableHead>
                <TableHead className="text-right">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/40">
                  <TableCell>
                    <Link
                      href={`/products/${product.id}`}
                      className="group flex items-center gap-3"
                    >
                      <ProductImage
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-10 w-10 shrink-0 rounded-md object-cover"
                      />
                      <span className="font-medium transition-colors group-hover:text-primary">
                        {product.name}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={product.quantity === 0 ? "destructive" : "secondary"}>
                      {product.quantity}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {product.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/products/${product.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setProductToDelete(product)}
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
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <Pagination
        page={meta?.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
        onPageChange={handlePageChange}
      />

      <AlertDialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { name: productToDelete?.name })}
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
