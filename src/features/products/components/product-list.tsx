"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, ChevronDown, Package, Pencil, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { cn } from "@/lib/utils";
import { productsApi } from "../api/products-api";
import { categoriesApi } from "@/features/categories/api/categories-api";
import type { Category, Product } from "../types/product-types";
import type { PaginationMeta } from "@/lib/pagination";
import { useAuth } from "@/features/auth/context/auth-provider";
import { ProductCard } from "./product-card";
import { ProductImage } from "./product-image";
import { PriceRangeSlider } from "./price-range-slider";
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
const PRICE_MIN = 0;
const PRICE_MAX = 500;

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-lg border bg-background">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-start"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <div className="px-3 pb-4">{children}</div>}
    </div>
  );
}

function CategoryCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          checked ? "border-primary bg-primary" : "border-input bg-background",
        )}
      >
        <Check
          className={cn(
            "h-3 w-3 text-primary-foreground transition-opacity",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
      <span
        className={cn(
          "font-medium transition-colors",
          checked ? "text-primary" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </label>
  );
}

export function ProductList({
  initialSearch = "",
  initialCategoryIds = [],
}: {
  initialSearch?: string;
  initialCategoryIds?: number[];
}) {
  const { isAdmin } = useAuth();
  const { t } = useTranslation("products");
  const { t: tCat } = useTranslation("categories");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);
  const [categoryIds, setCategoryIds] = useState<number[]>(initialCategoryIds);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const debouncedMinPrice = useDebouncedValue(minPrice, 400);
  const debouncedMaxPrice = useDebouncedValue(maxPrice, 400);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load categories once on mount
  useEffect(() => {
    categoriesApi.getAll().catch(() => {
      // non-fatal: category filter just won't show
    }).then((cats) => {
      if (cats) setCategories(cats);
    });
  }, []);

  useEffect(() => {
    let ignore = false;

    productsApi
      .getAll({
        page,
        limit,
        search,
        categoryIds,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
      })
      .then((res) => {
        if (!ignore) {
          setProducts(res.data);
          setMeta(res.meta);
          setHasLoaded(true);
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
  }, [
    page,
    limit,
    search,
    categoryIds,
    debouncedMinPrice,
    debouncedMaxPrice,
    refreshKey,
    t,
  ]);

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

  function toggleCategory(id: number) {
    setCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setPage(1);
    setIsLoading(true);
  }

  function clearAll() {
    setQuery("");
    setSearch("");
    setCategoryIds([]);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setPage(1);
    setIsLoading(true);
  }

  function handlePriceChange([lo, hi]: [number, number]) {
    setMinPrice(lo);
    setMaxPrice(hi);
    setPage(1);
  }

  const selectedCategories = categories.filter((cat) => categoryIds.includes(cat.id));
  const hasPriceFilter =
    (minPrice !== undefined && minPrice > PRICE_MIN) ||
    (maxPrice !== undefined && maxPrice < PRICE_MAX);

  const activeChips: { key: string; label: string; onRemove: () => void }[] = [];
  if (search) {
    activeChips.push({
      key: "search",
      label: search,
      onRemove: () => {
        setQuery("");
        setSearch("");
        setPage(1);
        setIsLoading(true);
      },
    });
  }
  selectedCategories.forEach((cat) =>
    activeChips.push({
      key: `category-${cat.id}`,
      label: cat.name,
      onRemove: () => toggleCategory(cat.id),
    }),
  );
  if (hasPriceFilter) {
    activeChips.push({
      key: "price",
      label: `$${minPrice ?? PRICE_MIN} – $${maxPrice ?? PRICE_MAX}`,
      onRemove: () => {
        setMinPrice(undefined);
        setMaxPrice(undefined);
        setPage(1);
        setIsLoading(true);
      },
    });
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
      } else {
        setRefreshKey((key) => key + 1);
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

  return (
    <div className="space-y-5">
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

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 space-y-4 lg:sticky lg:top-6 lg:w-64">
          <div className="rounded-lg border bg-background p-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">{t("search")}</p>
            <SearchInput
              value={query}
              onValueChange={setQuery}
              onSearch={handleSearchChange}
              placeholder={t("searchPlaceholder")}
              className="w-full"
            />
          </div>

          {categories.length > 0 && (
            <FilterSection title={tCat("filterBy")}>
              <div className="flex flex-col gap-0.5">
                <CategoryCheckbox
                  label={tCat("allCategories")}
                  checked={categoryIds.length === 0}
                  onChange={() => {
                    if (categoryIds.length > 0) {
                      setCategoryIds([]);
                      setPage(1);
                      setIsLoading(true);
                    }
                  }}
                />
                {categories.map((cat) => (
                  <CategoryCheckbox
                    key={cat.id}
                    label={cat.name}
                    checked={categoryIds.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                  />
                ))}
              </div>
            </FilterSection>
          )}

          <FilterSection title={t("filterByPrice")}>
            <PriceRangeSlider
              min={PRICE_MIN}
              max={PRICE_MAX}
              value={[minPrice ?? PRICE_MIN, maxPrice ?? PRICE_MAX]}
              onChange={handlePriceChange}
            />
          </FilterSection>
        </aside>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {t("results", { count: meta.total })}
            </p>
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

          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("activeFilters")}
              </span>
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="group inline-flex items-center gap-1.5 rounded-full bg-background py-1 pl-3 pr-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {chip.label}
                  <X className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="ms-auto text-xs font-medium text-primary underline-offset-2 hover:underline"
              >
                {t("clearAll")}
              </button>
            </div>
          )}

      {isLoading && !hasLoaded ? (
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
          <p className="text-sm text-muted-foreground">
            {categoryIds.length > 0 ? tCat("noProducts") : t("empty")}
          </p>
          {isAdmin && categoryIds.length === 0 && (
            <Button asChild size="sm" variant="outline">
              <Link href="/products/new">{t("createFirst")}</Link>
            </Button>
          )}
        </div>
      ) : (
        <div
          aria-busy={isLoading}
          className={cn(
            "transition-opacity duration-300",
            isLoading && hasLoaded ? "pointer-events-none opacity-50" : "opacity-100",
          )}
        >
        {isAdmin ? (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("table.product")}</TableHead>
                <TableHead>{t("table.category")}</TableHead>
                <TableHead>{t("table.price")}</TableHead>
                <TableHead>{t("table.quantity")}</TableHead>
                <TableHead>{t("table.description")}</TableHead>
                <TableHead className="text-end">{t("table.actions")}</TableHead>
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
                  <TableCell>
                    <Badge variant="outline">{product.category?.name ?? "—"}</Badge>
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
                  <TableCell className="text-end">
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
        </div>
      )}

      <Pagination
        page={meta?.page}
        totalPages={meta.totalPages}
        total={meta.total}
        limit={meta.limit}
        onPageChange={handlePageChange}
      />
        </div>
      </div>

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
              {isDeleting
                ? t("actions.deleting", { ns: "common" })
                : t("actions.delete", { ns: "common" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
