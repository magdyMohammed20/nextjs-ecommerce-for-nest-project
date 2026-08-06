"use client";

import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderStatusBadge } from "./order-status-badge";
import { formatDateTime, formatMoney } from "../lib/format";
import type { Order } from "../types/order-types";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) {
  const { t } = useTranslation("orders");

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("detail.title", { id: order.id })}</DialogTitle>
          <DialogDescription>
            {order.customerName} · {order.customerEmail}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("detail.status")}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("detail.total")}</span>
            <span className="font-semibold">{formatMoney(order.total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("detail.date")}</span>
            <span>{formatDateTime(order.createdAt)}</span>
          </div>
        </div>

        <div className="mt-2 rounded-lg border">
          <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2 text-sm font-medium">
            <span>{t("detail.itemsTitle")}</span>
            <span>{order.items?.length ?? 0}</span>
          </div>
          <ul className="divide-y">
            {(order.items ?? []).map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatMoney(item.unitPrice)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium">
                  {formatMoney(Number(item.unitPrice) * item.quantity)}
                </span>
              </li>
            ))}
            {!order.items?.length && (
              <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                {t("detail.noItems")}
              </li>
            )}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
