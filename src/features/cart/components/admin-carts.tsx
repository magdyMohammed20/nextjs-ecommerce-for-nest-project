"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Package, ShoppingCart, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/shared/pagination";
import { useAdminCarts } from "../hooks/use-cart";
import { formatMoney } from "../lib/format";

interface AdminCart {
  userId: number;
  userName: string;
  userEmail: string;
  items: {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    lineTotal: number;
  }[];
  subtotal: number;
  total: number;
  totalItems: number;
}

export function AdminCarts() {
  const { t } = useTranslation("cart");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useAdminCarts(page, limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.meta.totalPages ?? 1)) {
      setPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-10 w-64" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const carts = data?.data ?? [];
  const meta = data?.meta ?? { page: 1, limit, total: 0, totalPages: 1 };

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("adminTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {meta.total} {meta.total === 1 ? t("cartSingular") : t("cartPlural")}
          </p>
        </div>

        {carts.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <ShoppingCart className="h-7 w-7 text-muted-foreground" />
            </span>
            <h3 className="text-lg font-medium">{t("adminEmptyTitle")}</h3>
            <p className="text-sm text-muted-foreground">{t("adminEmptyDescription")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {carts.map((cart) => (
              <AdminCartRow key={cart.userId} cart={cart} />
            ))}
          </div>
        )}

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={handlePageChange}
        />
      </CardContent>
    </Card>
  );
}

function AdminCartRow({ cart }: { cart: AdminCart }) {
  const { t } = useTranslation("cart");
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-xl overflow-hidden">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <User className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium">{cart.userName || "—"}</p>
            <p className="text-sm text-muted-foreground">{cart.userEmail}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div>
            <span className="text-muted-foreground">{t("items")}</span>
            <span className="ml-2 font-medium">{cart.totalItems}</span>
          </div>
          <div className="font-medium text-primary">
            {formatMoney(cart.total)}
          </div>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </div>

      {expanded && (
        <div className="border-t bg-muted/30 p-4">
          <div className="space-y-2">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="font-medium truncate">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} × {formatMoney(item.price)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">{t("lineTotal")}</span>
                  <span className="font-medium">{formatMoney(item.lineTotal)}</span>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="font-medium">{t("total")}</span>
              <span className="font-bold text-lg">{formatMoney(cart.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}