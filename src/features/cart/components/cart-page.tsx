"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/features/products/components/product-image";
import { useCart } from "../hooks/use-cart";
import { formatMoney } from "../lib/format";

export function CartPage() {
  const { t } = useTranslation("cart");
  const { cart, isLoading, updateQuantity, removeItem, clearCart, addItem } = useCart();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </span>
        <h1 className="text-2xl font-bold">{t("emptyTitle")}</h1>
        <p className="max-w-sm text-sm text-muted-foreground">{t("emptyDescription")}</p>
        <Button asChild size="lg" className="mt-2">
          <Link href="/products">{t("browseProducts")}</Link>
        </Button>
      </div>
    );
  }

  function changeQuantity(productId: number, next: number) {
    if (next < 1) {
      removeItem.mutate(productId, {
        onError: (err) => toast.error(err instanceof Error ? err.message : t("updateFailed")),
      });
      return;
    }
    updateQuantity.mutate(
      { productId, quantity: next },
      {
        onError: (err) => toast.error(err instanceof Error ? err.message : t("updateFailed")),
      },
    );
  }

  function handleRemove(productId: number) {
    removeItem.mutate(productId, {
      onError: (err) => toast.error(err instanceof Error ? err.message : t("removeFailed")),
    });
  }

  function handleClear() {
    clearCart.mutate(undefined, {
      onError: (err) => toast.error(err instanceof Error ? err.message : t("clearFailed")),
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.productId} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                  <ProductImage
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/products/${item.productId}`}
                    className="line-clamp-1 font-semibold hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {formatMoney(Number(item.product.price))} × {item.quantity}
                  </p>
                  <p className="mt-1 font-semibold text-primary">
                    {formatMoney(Number(item.product.price) * item.quantity)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center rounded-lg border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-8 rounded-none"
                      aria-label={t("decreaseQuantity")}
                      onClick={() => changeQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-8 rounded-none"
                      aria-label={t("increaseQuantity")}
                      onClick={() => changeQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleRemove(item.productId)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    {t("remove")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="h-fit">
          <CardContent className="space-y-4 p-5">
            <h2 className="text-lg font-semibold">{t("summaryTitle")}</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("itemsCount")}</span>
              <span>{cart?.totalItems}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{t("subtotal")}</span>
              <span>{formatMoney(Number(cart?.subtotal ?? 0))}</span>
            </div>
            <div className="flex justify-between border-t pt-3 text-base font-semibold">
              <span>{t("total")}</span>
              <span>{formatMoney(Number(cart?.total ?? 0))}</span>
            </div>
            <Button className="w-full" disabled={addItem.isPending}>
              {addItem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("checkout")}
            </Button>
            <Button variant="outline" className="w-full" onClick={handleClear} disabled={clearCart.isPending}>
              {t("clearCart")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
