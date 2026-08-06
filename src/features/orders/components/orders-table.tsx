"use client";

import { useEffect, useState } from "react";
import { Eye, Receipt, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { ordersApi } from "../api/orders-api";
import type { Order, OrderStatus } from "../types/order-types";
import { formatDate, formatMoney } from "../lib/format";
import { OrderStatusSelect } from "./order-status-select";
import { OrderDetailDialog } from "./order-detail-dialog";
import type { PaginationMeta } from "@/lib/pagination";
import { Button } from "@/components/ui/button";
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
import { ORDER_STATUSES } from "../types/order-types";

const LIMIT = 10;

export function OrdersTable() {
  const { t } = useTranslation("orders");

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [orderToView, setOrderToView] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    let ignore = false;

    ordersApi
      .getAll({ page, limit: LIMIT, search, status: status || undefined })
      .then((res) => {
        if (!ignore) {
          setOrders(res.data);
          setMeta(res.meta);
        }
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
  }, [page, search, status, t]);

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

  async function handleStatusChange(order: Order, nextStatus: OrderStatus) {
    if (nextStatus === order.status) return;
    setUpdatingId(order.id);
    try {
      const updated = await ordersApi.updateStatus(order.id, nextStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === order.id ? { ...o, ...updated } : o)),
      );
      toast.success(t("toasts.statusUpdated", { id: order.id }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.statusFailed"),
      );
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleCancel() {
    if (!orderToCancel) return;
    setIsCancelling(true);
    try {
      const updated = await ordersApi.updateStatus(orderToCancel.id, "cancelled");
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderToCancel.id ? { ...o, ...updated } : o,
        ),
      );
      toast.success(t("toasts.cancelled", { id: orderToCancel.id }));
      setOrderToCancel(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.cancelFailed"),
      );
    } finally {
      setIsCancelling(false);
    }
  }

  async function handleView(id: number) {
    try {
      const order = await ordersApi.getById(id);
      setOrderToView(order);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toasts.loadFailed"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={query}
          onValueChange={setQuery}
          onSearch={handleSearchChange}
          placeholder={t("searchPlaceholder")}
          className="w-full sm:w-80"
        />
        <Select
          value={status}
          onValueChange={(next) => {
            setStatus(next as OrderStatus | "");
            setPage(1);
            setIsLoading(true);
          }}
        >
          <SelectTrigger className="h-10 w-full sm:w-48">
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
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("table.id")}</TableHead>
                <TableHead>{t("table.customer")}</TableHead>
                <TableHead>{t("table.items")}</TableHead>
                <TableHead>{t("table.total")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.date")}</TableHead>
                <TableHead className="text-end">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const itemCount = order.items?.reduce(
                  (sum, item) => sum + item.quantity,
                  0,
                ) ?? 0;
                const canCancel = !["cancelled", "delivered"].includes(
                  order.status,
                );
                return (
                  <TableRow key={order.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">
                      #{order.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {itemCount}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatMoney(order.total)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusSelect
                        value={order.status}
                        disabled={updatingId === order.id}
                        onValueChange={(next) =>
                          handleStatusChange(order, next)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          title={t("viewOrder")}
                          onClick={() => handleView(order.id)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span className="sr-only">{t("viewOrder")}</span>
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
                            <span className="sr-only">{t("cancelOrder")}</span>
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
