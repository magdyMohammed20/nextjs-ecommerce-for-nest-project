"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Eye, Receipt } from "lucide-react";
import { ordersApi } from "../api/orders-api";
import type { Order } from "../types/order-types";
import { formatDate, formatMoney } from "../lib/format";
import { OrderStatusBadge } from "./order-status-badge";
import { OrderDetailDialog } from "./order-detail-dialog";
import type { PaginationMeta } from "@/lib/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";

const LIMIT = 10;

export function MyOrdersList() {
  const { t } = useTranslation("orders");

  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [orderToView, setOrderToView] = useState<Order | null>(null);

  useEffect(() => {
    let ignore = false;

    ordersApi
      .getMine({ page, limit: LIMIT })
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
  }, [page, t]);

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    setIsLoading(true);
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <Receipt className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{t("mine.empty")}</p>
        <Button asChild size="sm" className="mt-1">
          <Link href="/products">{t("mine.emptyAction")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {orders.map((order) => {
          const itemCount = order.items?.reduce(
            (sum, item) => sum + item.quantity,
            0,
          ) ?? 0;
          return (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">#{order.id}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("mine.placedDate", { date: formatDate(order.createdAt) })}
                  </p>
                  <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                    {order.items?.map((item) => item.productName).join(", ") || (
                      <span className="italic">{t("detail.noItems")}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                  <p className="text-base font-semibold">{formatMoney(order.total)}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("mine.itemsCount", { count: itemCount })}
                  </p>
                </div>
                <div className="sm:flex-none">
                  <Button
                    size="sm"
                    variant="outline"
                    title={t("viewOrder")}
                    onClick={() => setOrderToView(order)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5 rtl:ml-1.5 rtl:mr-0" />
                    {t("viewOrder")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

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
    </div>
  );
}
