"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  Eye,
  PackageCheck,
  Printer,
  Receipt,
  ShoppingBag,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import { ordersApi } from "../api/orders-api";
import type { Order, OrderStatus, OrderStats } from "../types/order-types";
import { formatDate, formatMoney } from "../lib/format";
import { printOrderInvoice } from "../lib/invoice";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailDialog } from "./order-detail-dialog";
import type { PaginationMeta } from "@/lib/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ORDER_STATUSES } from "../types/order-types";

const LIMIT = 10;

type SortValue = "createdAt:DESC" | "createdAt:ASC" | "total:DESC" | "total:ASC";

const SORT_OPTIONS: Array<{ value: SortValue; labelKey: string }> = [
  { value: "createdAt:DESC", labelKey: "mine.sortNewest" },
  { value: "createdAt:ASC", labelKey: "mine.sortOldest" },
  { value: "total:DESC", labelKey: "mine.sortHighest" },
  { value: "total:ASC", labelKey: "mine.sortLowest" },
];

export function MyOrdersList() {
  const { t } = useTranslation("orders");

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [sortValue, setSortValue] = useState<SortValue>("createdAt:DESC");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderToView, setOrderToView] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const [sortBy, sortOrder] = sortValue.split(":") as [
    "id" | "createdAt" | "total",
    "ASC" | "DESC",
  ];

  useEffect(() => {
    let ignore = false;
    ordersApi
      .getMineStats()
      .then((res) => {
        if (!ignore) setStats(res);
      })
      .catch(() => {
        if (!ignore) setStats(null);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const loadOrders = useCallback(() => {
    let ignore = false;

    ordersApi
      .getMine({ page, limit: LIMIT, search, status: status || undefined, sortBy, sortOrder })
      .then((res) => {
        if (ignore) return;
        // The last item on a filtered page may no longer match the filter,
        // leaving an empty page — fall back to the last valid page.
        if (res.data.length === 0 && page > 1) {
          setPage(Math.max(1, res.meta.totalPages));
          return;
        }
        setOrders(res.data);
        setMeta(res.meta);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("toasts.failedToLoad"),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, search, status, sortBy, sortOrder, t]);

  useEffect(() => loadOrders(), [loadOrders]);

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

  function handleFilterChange(next: OrderStatus | "" | SortValue) {
    if (next === status || next === sortValue) return;
    if (SORT_OPTIONS.some((option) => option.value === next)) {
      setSortValue(next as SortValue);
    } else {
      setStatus(next as OrderStatus | "");
    }
    setPage(1);
    setIsLoading(true);
  }

  async function refreshStats() {
    try {
      setStats(await ordersApi.getMineStats());
    } catch {
      // stats are best-effort
    }
  }

  async function handleCancel() {
    if (!orderToCancel) return;
    setIsCancelling(true);
    try {
      const updated = await ordersApi.cancelMine(orderToCancel.id);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderToCancel.id ? { ...o, ...updated } : o)),
      );
      toast.success(t("toasts.cancelled", { id: orderToCancel.id }));
      setOrderToCancel(null);
      await refreshStats();
      loadOrders();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.cancelFailed"),
      );
    } finally {
      setIsCancelling(false);
    }
  }

  function handleInvoice(order: Order) {
    const dir =
      typeof document !== "undefined" &&
      document.documentElement.dir === "rtl"
        ? "rtl"
        : "ltr";
    printOrderInvoice(
      order,
      {
        brand: t("appName", { ns: "common" }),
        title: t("invoice.title"),
        print: t("invoice.print"),
        order: t("invoice.order"),
        placed: t("invoice.placed"),
        customer: t("invoice.customer"),
        phone: t("invoice.phone"),
        address: t("invoice.address"),
        notes: t("invoice.notes"),
        status: t(`statuses.${order.status}`),
        items: t("invoice.items"),
        product: t("invoice.product"),
        quantity: t("invoice.quantity"),
        unitPrice: t("invoice.unitPrice"),
        lineTotal: t("invoice.lineTotal"),
        total: t("invoice.total"),
        noItems: t("invoice.noItems"),
        noAddress: t("invoice.noAddress"),
        footer: t("invoice.footer"),
      },
      dir,
    );
  }

  const hasFilters = Boolean(search || status);
  const statCards = [
    {
      key: "totalOrders",
      label: t("mine.stats.totalOrders"),
      value: stats ? String(stats.totalOrders) : "—",
      icon: ShoppingBag,
    },
    {
      key: "totalSpent",
      label: t("mine.stats.totalSpent"),
      value: stats ? formatMoney(stats.totalSpent) : "—",
      icon: Wallet,
    },
    {
      key: "activeOrders",
      label: t("mine.stats.activeOrders"),
      value: stats ? String(stats.activeOrders) : "—",
      icon: Truck,
    },
    {
      key: "completedOrders",
      label: t("mine.stats.completedOrders"),
      value: stats ? String(stats.completedOrders) : "—",
      icon: PackageCheck,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.key}>
            <CardContent className="flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">
                  {card.label}
                </p>
                <p className="text-lg font-semibold">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          onSearch={handleSearchChange}
          placeholder={t("mine.searchPlaceholder")}
          className="w-full lg:w-72"
        />
        <Select
          value={status}
          onValueChange={(next) =>
            handleFilterChange(next as OrderStatus | "")
          }
        >
          <SelectTrigger className="h-10 w-full sm:w-44">
            <SelectValue placeholder={t("allStatuses")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{t("allStatuses")}</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`statuses.${s}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sortValue}
          onValueChange={(next) => handleFilterChange(next as SortValue)}
        >
          <SelectTrigger className="h-10 w-full sm:w-48">
            <SelectValue placeholder={t("mine.sortLabel")} />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {t(option.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <AnimatedResults signature={`${search}|${status}|${sortValue}|${page}`}>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              {hasFilters ? t("mine.emptyFiltered") : t("mine.empty")}
            </p>
            {!hasFilters && (
              <Button asChild size="sm" className="mt-1">
                <Link href="/products">{t("mine.emptyAction")}</Link>
              </Button>
            )}
          </div>
        ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("table.id")}</TableHead>
                <TableHead>{t("mine.table.placed")}</TableHead>
                <TableHead>{t("table.items")}</TableHead>
                <TableHead>{t("table.total")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-end">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const itemCount =
                  order.items?.reduce((sum, item) => sum + item.quantity, 0) ??
                  0;
                const canCancel =
                  order.status === "pending" || order.status === "confirmed";
                return (
                  <TableRow key={order.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {itemCount}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatMoney(order.total)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          title={t("viewOrder")}
                          onClick={() => setOrderToView(order)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only">{t("viewOrder")}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          title={t("invoice.title")}
                          onClick={() => handleInvoice(order)}
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span className="sr-only">{t("invoice.title")}</span>
                        </Button>
                        {canCancel && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            title={t("cancelOrder")}
                            onClick={() => setOrderToCancel(order)}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span className="sr-only">
                              {t("cancelOrder")}
                            </span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

        <Pagination
          page={meta?.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={handlePageChange}
        />
      </AnimatedResults>

      <OrderDetailDialog
        order={orderToView}
        open={Boolean(orderToView)}
        onOpenChange={(open) => !open && setOrderToView(null)}
      />

      <AlertDialog
        open={Boolean(orderToCancel)}
        onOpenChange={(open) => !open && setOrderToCancel(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("cancelDialog.title", { id: orderToCancel?.id })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("cancelDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              {t("actions.cancel", { ns: "common" })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling
                ? t("actions.cancelling")
                : t("actions.cancelOrder")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
