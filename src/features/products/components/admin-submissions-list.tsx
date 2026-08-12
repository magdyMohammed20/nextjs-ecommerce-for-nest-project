"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Clock,
  ExternalLink,
  ListChecks,
  Loader2,
  Package,
  RotateCcw,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { productsApi } from "../api/products-api";
import type { Product, ProductStatus } from "../types/product-types";
import { ProductStatusBadge } from "./product-status-badge";
import { ProductImage } from "./product-image";
import { formatDate, formatMoney } from "@/features/orders/lib/format";
import type { PaginationMeta } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonList } from "@/components/shared/skeletons";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { AnimatedResults } from "@/components/shared/animated-results";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LIMIT = 10;
const NOTE_MAX = 255;

type SortKey = "newest" | "oldest" | "priceAsc" | "priceDesc";

const SORT_OPTIONS: Array<{
  key: SortKey;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
}> = [
  { key: "newest", sortBy: "createdAt", sortOrder: "DESC" },
  { key: "oldest", sortBy: "createdAt", sortOrder: "ASC" },
  { key: "priceAsc", sortBy: "price", sortOrder: "ASC" },
  { key: "priceDesc", sortBy: "price", sortOrder: "DESC" },
];

function TableCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer items-center">
      <span className="sr-only">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors",
          checked
            ? "border-primary bg-primary"
            : "border-input bg-background",
        )}
      >
        <Check
          className={cn(
            "h-3 w-3 text-primary-foreground transition-opacity",
            checked ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </label>
  );
}

export function AdminSubmissionsList() {
  const { t } = useTranslation("dashboard");
  const { t: tCommon } = useTranslation("common");

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("pending");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [reviewing, setReviewing] = useState<Product | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkRejectOpen, setBulkRejectOpen] = useState(false);
  const [bulkRejectNote, setBulkRejectNote] = useState("");

  const sortOption = SORT_OPTIONS.find((option) => option.key === sortKey)!;

  const loadProducts = useCallback(() => {
    let ignore = false;

    productsApi
      .getAll({
        page,
        limit: LIMIT,
        search,
        status: status || undefined,
        sortBy: sortOption.sortBy,
        sortOrder: sortOption.sortOrder,
      })
      .then((res) => {
        if (ignore) return;
        if (res.data.length === 0 && page > 1) {
          setPage(Math.max(1, res.meta.totalPages));
          return;
        }
        setProducts(res.data);
        setMeta(res.meta);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("submissions.failedToLoad"),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, search, status, sortOption, t]);

  useEffect(() => loadProducts(), [loadProducts]);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    setIsLoading(true);
  }

  function handleSearchChange(nextSearch: string) {
    if (nextSearch === search) return;
    setSearch(nextSearch);
    setPage(1);
    setSelectedIds(new Set());
    setIsLoading(true);
  }

  function handleStatusFilter(next: string) {
    if (next === status) return;
    setStatus(next as ProductStatus | "");
    setPage(1);
    setSelectedIds(new Set());
  }

  function handleSortChange(next: string) {
    if (next === sortKey) return;
    setSortKey(next as SortKey);
    setPage(1);
    setSelectedIds(new Set());
    setIsLoading(true);
  }

  function openReview(product: Product) {
    setReviewing(product);
    setReviewNote("");
    setShowRejectForm(false);
  }

  function openReject(product: Product) {
    setReviewing(product);
    setReviewNote("");
    setShowRejectForm(true);
  }

  const updateRow = (id: number, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  async function handleApprove(product: Product) {
    setUpdatingId(product.id);
    const prev = { ...product };
    updateRow(product.id, { status: "active", rejectionNote: null });
    try {
      await productsApi.updateStatus(product.id, { status: "active" });
      toast.success(t("submissions.approved"));
      setReviewing(null);
      loadProducts();
    } catch (error) {
      updateRow(product.id, prev);
      toast.error(
        error instanceof Error
          ? error.message
          : tCommon("toasts.somethingWentWrong"),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleReopen(product: Product) {
    setUpdatingId(product.id);
    const prev = { ...product };
    updateRow(product.id, { status: "pending", rejectionNote: null });
    try {
      await productsApi.updateStatus(product.id, { status: "pending" });
      toast.success(t("submissions.reopened"));
      setReviewing(null);
      loadProducts();
    } catch (error) {
      updateRow(product.id, prev);
      toast.error(
        error instanceof Error
          ? error.message
          : tCommon("toasts.somethingWentWrong"),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmRejectFromReview() {
    if (!reviewing) return;
    setUpdatingId(reviewing.id);
    const prev = { ...reviewing };
    updateRow(reviewing.id, {
      status: "rejected",
      rejectionNote: reviewNote || undefined,
    });
    try {
      await productsApi.updateStatus(reviewing.id, {
        status: "rejected",
        rejectionNote: reviewNote || undefined,
      });
      toast.success(t("submissions.rejected"));
      setReviewing(null);
      loadProducts();
    } catch (error) {
      updateRow(reviewing.id, prev);
      toast.error(
        error instanceof Error
          ? error.message
          : tCommon("toasts.somethingWentWrong"),
      );
    } finally {
      setUpdatingId(null);
      setReviewNote("");
      setShowRejectForm(false);
    }
  }

  function toggleSelected(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAllOnPage() {
    const pendingIds = products
      .filter((product) => product.status === "pending")
      .map((product) => product.id);
    if (pendingIds.length === 0) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = pendingIds.every((id) => next.has(id));
      for (const id of pendingIds) {
        if (allSelected) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  async function approveSelected() {
    if (selectedIds.size === 0 || bulkBusy) return;
    setBulkBusy(true);
    let ok = 0;
    let failed = 0;
    for (const id of selectedIds) {
      try {
        await productsApi.updateStatus(id, { status: "active" });
        updateRow(id, { status: "active", rejectionNote: null });
        ok += 1;
      } catch {
        failed += 1;
      }
    }
    setSelectedIds(new Set());
    setBulkBusy(false);
    loadProducts();
    if (ok > 0) toast.success(t("submissions.bulk.approved", { count: ok }));
    if (failed > 0) {
      toast.error(t("submissions.bulk.failed", { count: failed }));
    }
  }

  async function confirmBulkReject() {
    if (selectedIds.size === 0 || bulkBusy) return;
    setBulkBusy(true);
    let ok = 0;
    let failed = 0;
    const note = bulkRejectNote || undefined;
    for (const id of selectedIds) {
      try {
        await productsApi.updateStatus(id, {
          status: "rejected",
          rejectionNote: note,
        });
        updateRow(id, { status: "rejected", rejectionNote: note ?? null });
        ok += 1;
      } catch {
        failed += 1;
      }
    }
    setSelectedIds(new Set());
    setBulkBusy(false);
    setBulkRejectOpen(false);
    setBulkRejectNote("");
    loadProducts();
    if (ok > 0) toast.success(t("submissions.bulk.rejected", { count: ok }));
    if (failed > 0) {
      toast.error(t("submissions.bulk.failed", { count: failed }));
    }
  }

  const pendingIds = products
    .filter((product) => product.status === "pending")
    .map((product) => product.id);
  const allOnPageSelected =
    pendingIds.length > 0 && pendingIds.every((id) => selectedIds.has(id));
  const selectedCount = selectedIds.size;

  const reasonPresets = [
    { key: "duplicate", label: t("submissions.presets.duplicate") },
    { key: "description", label: t("submissions.presets.description") },
    { key: "image", label: t("submissions.presets.image") },
    { key: "content", label: t("submissions.presets.content") },
    { key: "price", label: t("submissions.presets.price") },
  ];

  const isUpdating = (id: number) => updatingId === id;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          onSearch={handleSearchChange}
          placeholder={t("submissions.searchPlaceholder")}
          className="w-full sm:w-72"
        />
        <Select value={status} onValueChange={handleStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-44">
            <SelectValue placeholder={t("submissions.filter.all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("submissions.filter.all")}</SelectItem>
            <SelectItem value="pending">
              {tCommon("statuses.pending")}
            </SelectItem>
            <SelectItem value="active">
              {tCommon("statuses.active")}
            </SelectItem>
            <SelectItem value="rejected">
              {tCommon("statuses.rejected")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortKey} onValueChange={handleSortChange}>
          <SelectTrigger className="h-9 w-full sm:w-52">
            <SelectValue placeholder={t("submissions.sort.label")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t("submissions.sort.newest")}</SelectItem>
            <SelectItem value="oldest">{t("submissions.sort.oldest")}</SelectItem>
            <SelectItem value="priceAsc">
              {t("submissions.sort.priceAsc")}
            </SelectItem>
            <SelectItem value="priceDesc">
              {t("submissions.sort.priceDesc")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedCount > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ListChecks className="h-4 w-4 text-primary" />
            <span>{t("submissions.bulk.selected", { count: selectedCount })}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              disabled={bulkBusy}
              onClick={approveSelected}
            >
              {bulkBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              )}
              {t("submissions.bulk.approveSelected")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5 text-destructive hover:text-destructive"
              disabled={bulkBusy}
              onClick={() => {
                setBulkRejectNote("");
                setBulkRejectOpen(true);
              }}
            >
              <X className="h-3.5 w-3.5" />
              {t("submissions.bulk.rejectSelected")}
            </Button>
          </div>
        </div>
      )}

      <AnimatedResults signature={`${search}|${status}|${sortKey}|${page}`}>
        {isLoading ? (
          <SkeletonList count={LIMIT} />
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {search || status
                ? t("submissions.emptyFiltered")
                : t("submissions.empty")}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-10">
                      <TableCheckbox
                        checked={allOnPageSelected}
                        onChange={toggleAllOnPage}
                        label={t("submissions.table.selectAll")}
                      />
                    </TableHead>
                    <TableHead>{t("submissions.table.product")}</TableHead>
                    <TableHead>{t("submissions.table.owner")}</TableHead>
                    <TableHead>{t("submissions.table.price")}</TableHead>
                    <TableHead>{t("submissions.table.status")}</TableHead>
                    <TableHead>{t("submissions.table.rejectionNote")}</TableHead>
                    <TableHead>{t("submissions.table.submitted")}</TableHead>
                    <TableHead className="text-end">
                      {t("submissions.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const canModerate = product.status === "pending";
                  return (
                    <TableRow
                      key={product.id}
                      className={cn(
                        "hover:bg-muted/40",
                        selectedIds.has(product.id) && "bg-primary/5",
                      )}
                    >
                      <TableCell>
                        {canModerate && (
                          <TableCheckbox
                            checked={selectedIds.has(product.id)}
                            onChange={() => toggleSelected(product.id)}
                            label={t("submissions.table.select")}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <button
                          type="button"
                          className="group flex items-center gap-3 font-medium text-start"
                          onClick={() => openReview(product)}
                        >
                          <ProductImage
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 shrink-0 rounded-lg"
                          />
                          <span className="transition-colors group-hover:text-primary">
                            {product.name}
                          </span>
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {product.ownerName ? (
                            <>
                              <span className="font-medium">
                                {product.ownerName}
                              </span>
                              {product.ownerEmail && (
                                <span className="text-xs text-muted-foreground">
                                  {product.ownerEmail}
                                </span>
                              )}
                            </>
                          ) : product.userId != null ? (
                            <span className="text-muted-foreground">
                              {t("submissions.details.anonymousOwner", {
                                id: product.userId,
                              })}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatMoney(product.price)}</TableCell>
                      <TableCell>
                        <ProductStatusBadge status={product.status} />
                      </TableCell>
                      <TableCell>
                        {product.rejectionNote ? (
                          <span className="block max-w-xs truncate text-sm text-muted-foreground">
                            {product.rejectionNote}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {product.createdAt ? formatDate(product.createdAt) : "—"}
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                          {product.status === "active" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              asChild
                              title={t("submissions.preview")}
                            >
                              <Link
                                href={`/products/${product.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span className="sr-only">
                                  {t("submissions.preview")}
                                </span>
                              </Link>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("submissions.viewDetails")}
                            disabled={isUpdating(product.id)}
                            onClick={() => openReview(product)}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            <span className="sr-only">
                              {t("submissions.viewDetails")}
                            </span>
                          </Button>
                          {canModerate && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                title={t("submissions.approve")}
                                disabled={isUpdating(product.id)}
                                onClick={() => handleApprove(product)}
                              >
                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                <span>{t("submissions.approve")}</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-destructive hover:text-destructive"
                                title={t("submissions.reject")}
                                disabled={isUpdating(product.id)}
                                onClick={() => openReject(product)}
                              >
                                <X className="h-3.5 w-3.5" />
                                <span>{t("submissions.reject")}</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <Pagination
            page={meta?.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={handlePageChange}
          />
        </>
      )}
      </AnimatedResults>

      <Dialog
        open={Boolean(reviewing)}
        onOpenChange={(open) => {
          if (!open) {
            setReviewing(null);
            setReviewNote("");
            setShowRejectForm(false);
          }
        }}
      >
        {reviewing && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("submissions.detailsTitle")}</DialogTitle>
              <DialogDescription>{reviewing.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="flex items-start gap-4">
                <ProductImage
                  src={reviewing.imageUrl}
                  alt={reviewing.name}
                  className="h-24 w-24 shrink-0 rounded-lg"
                />
                <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions.table.status")}
                    </p>
                    <ProductStatusBadge status={reviewing.status} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions.table.price")}
                    </p>
                    <p className="font-medium">
                      {formatMoney(reviewing.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions.details.category")}
                    </p>
                    <p className="font-medium">
                      {reviewing.category?.name ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions.details.quantity")}
                    </p>
                    <p className="font-medium">{reviewing.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions.details.owner")}
                    </p>
                    <p className="font-medium">
                      {reviewing.ownerName ? (
                        <>
                          {reviewing.ownerName}
                          {reviewing.ownerEmail && (
                            <span className="ms-2 text-xs text-muted-foreground">
                              {reviewing.ownerEmail}
                            </span>
                          )}
                        </>
                      ) : reviewing.userId != null ? (
                        t("submissions.details.anonymousOwner", {
                          id: reviewing.userId,
                        })
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t("submissions.table.submitted")}
                    </p>
                    <p className="font-medium">
                      {reviewing.createdAt
                        ? formatDate(reviewing.createdAt)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground">
                  {t("submissions.details.description")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {reviewing.description || t("submissions.details.noDescription")}
                </p>
              </div>

              {reviewing.status === "rejected" && reviewing.rejectionNote && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <p className="text-xs font-medium text-destructive">
                    {t("submissions.table.rejectionNote")}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {reviewing.rejectionNote}
                  </p>
                </div>
              )}

              {reviewing.status === "pending" && showRejectForm && (
                <RejectForm
                  note={reviewNote}
                  onNoteChange={setReviewNote}
                  presets={reasonPresets}
                />
              )}
            </div>

            <DialogFooter>
              {reviewing.status === "pending" && !showRejectForm ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setReviewing(null)}
                  >
                    {tCommon("actions.cancel")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    disabled={isUpdating(reviewing.id)}
                    onClick={() => handleApprove(reviewing)}
                  >
                    {isUpdating(reviewing.id) ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                    {t("submissions.approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1.5"
                    disabled={isUpdating(reviewing.id)}
                    onClick={() => setShowRejectForm(true)}
                  >
                    <X className="h-3.5 w-3.5" />
                    {t("submissions.reject")}
                  </Button>
                </>
              ) : reviewing.status === "pending" && showRejectForm ? (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowRejectForm(false)}
                  >
                    {tCommon("actions.cancel")}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1.5"
                    disabled={isUpdating(reviewing.id)}
                    onClick={confirmRejectFromReview}
                  >
                    {isUpdating(reviewing.id) ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                    {t("submissions.confirmReject")}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setReviewing(null)}
                  >
                    {tCommon("actions.cancel")}
                  </Button>
                  {reviewing.status === "active" && (
                    <Button size="sm" variant="outline" asChild>
                      <Link
                        href={`/products/${reviewing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {t("submissions.preview")}
                      </Link>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    disabled={isUpdating(reviewing.id)}
                    onClick={() => handleReopen(reviewing)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    {t("submissions.reopen")}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog
        open={bulkRejectOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkRejectOpen(false);
            setBulkRejectNote("");
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {t("submissions.bulk.rejectTitle", { count: selectedCount })}
            </DialogTitle>
            <DialogDescription>
              {t("submissions.bulk.rejectDescription", { count: selectedCount })}
            </DialogDescription>
          </DialogHeader>

          <RejectForm
            note={bulkRejectNote}
            onNoteChange={setBulkRejectNote}
            presets={reasonPresets}
          />

          <DialogFooter>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setBulkRejectOpen(false)}
            >
              {tCommon("actions.cancel")}
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="gap-1.5"
              disabled={bulkBusy}
              onClick={confirmBulkReject}
            >
              {bulkBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              {t("submissions.bulk.rejectConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RejectForm({
  note,
  onNoteChange,
  presets,
}: {
  note: string;
  onNoteChange: (note: string) => void;
  presets: Array<{ key: string; label: string }>;
}) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {t("submissions.rejectDialog.noteLabel")}
      </label>
      {presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => {
            const active = note === preset.label;
            return (
              <button
                key={preset.key}
                type="button"
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-input text-muted-foreground hover:bg-muted",
                )}
                onClick={() => onNoteChange(active ? "" : preset.label)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      )}
      <Textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder={t("submissions.rejectDialog.notePlaceholder")}
        maxLength={NOTE_MAX}
        rows={3}
      />
      <p className="text-end text-xs text-muted-foreground">
        {note.length}/{NOTE_MAX}
      </p>
    </div>
  );
}
