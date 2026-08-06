"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, PackageCheck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/features/products/components/product-image";
import { useAuth } from "@/features/auth/context/auth-provider";
import { ordersApi } from "@/features/orders/api/orders-api";
import type { Order } from "@/features/orders/types/order-types";
import { useCart } from "../hooks/use-cart";
import { formatMoney } from "../lib/format";

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

export function CheckoutPage() {
  const { t } = useTranslation("cart");
  const { cart, isLoading, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (placedOrder) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
          <PackageCheck className="h-8 w-8 text-emerald-600" />
        </span>
        <h1 className="text-2xl font-bold">{t("successTitle")}</h1>
        <p className="text-sm text-muted-foreground">
          {t("successDescription", { id: placedOrder.id })}
        </p>
        {!isAuthenticated && (
          <p className="text-sm text-muted-foreground">{t("successGuestNote")}</p>
        )}
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          {isAuthenticated ? (
            <Button asChild size="lg">
              <Link href="/my-dashboard/orders">{t("viewOrders")}</Link>
            </Button>
          ) : (
            <Button asChild size="lg">
              <Link href="/login?next=/my-dashboard/orders">{t("signIn")}</Link>
            </Button>
          )}
          <Button asChild variant="outline" size="lg">
            <Link href="/products">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
        </span>
        <h1 className="text-2xl font-bold">{t("checkoutEmpty")}</h1>
        <Button asChild size="lg" className="mt-2">
          <Link href="/products">{t("checkoutEmptyAction")}</Link>
        </Button>
      </div>
    );
  }

  const orderItems = items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isAuthenticated) {
      if (!name.trim()) {
        toast.error(t("nameRequired"));
        return;
      }
      if (!email.trim()) {
        toast.error(t("emailRequired"));
        return;
      }
      if (!EMAIL_PATTERN.test(email)) {
        toast.error(t("emailInvalid"));
        return;
      }
    }

    setPlacing(true);
    const request = isAuthenticated
      ? ordersApi.createForUser({ items: orderItems })
      : ordersApi.create({
          customerName: name.trim(),
          customerEmail: email.trim(),
          items: orderItems,
        });

    request
      .then((order) => {
        clearCart.mutate(undefined);
        if (isAuthenticated) {
          toast.success(t("orderPlaced", { id: order.id }));
          router.push("/my-dashboard/orders");
        } else {
          setPlacedOrder(order);
        }
      })
      .catch((error) => {
        toast.error(
          error instanceof Error ? error.message : t("orderFailed"),
        );
      })
      .finally(() => setPlacing(false));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("checkoutTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("checkoutSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="h-fit">
          <CardContent className="space-y-4 p-5">
            <h2 className="text-lg font-semibold">{t("contactTitle")}</h2>
            {isAuthenticated ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="checkout-name">{t("name")}</Label>
                  <Input
                    id="checkout-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("namePlaceholder")}
                    autoComplete="name"
                    disabled={placing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkout-email">{t("email")}</Label>
                  <Input
                    id="checkout-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    autoComplete="email"
                    disabled={placing}
                  />
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={placing}>
              {placing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {placing ? t("placing") : t("placeOrder")}
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardContent className="space-y-4 p-5">
            <h2 className="text-lg font-semibold">{t("reviewTitle")}</h2>
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.productId} className="flex items-center gap-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border">
                    <ProductImage
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} × {formatMoney(Number(item.product.price))}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatMoney(Number(item.product.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t pt-3 text-base font-semibold">
              <span>{t("total")}</span>
              <span>{formatMoney(Number(cart?.total ?? 0))}</span>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
