"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Lock, PackageCheck, Phone, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductImage } from "@/features/products/components/product-image";
import { useAuth } from "@/features/auth/context/auth-provider";
import { ordersApi } from "@/features/orders/api/orders-api";
import type { Order } from "@/features/orders/types/order-types";
import { useCart } from "../hooks/use-cart";
import { formatMoney } from "../lib/format";
import { checkoutSchema, type CheckoutFormValues } from "../schemas/checkout-schema";

const INITIAL_FORM: CheckoutFormValues = {
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  notes: "",
};

export function CheckoutPage() {
  const { t } = useTranslation("cart");
  const { cart, isLoading, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const form = useForm<CheckoutFormValues>({
    mode: "onTouched",
    resolver: zodResolver(checkoutSchema),
    defaultValues: INITIAL_FORM,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </span>
        <h1 className="text-2xl font-bold">{t("mustSignIn")}</h1>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/login?next=/checkout">{t("signIn")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/cart">{t("backToCart")}</Link>
          </Button>
        </div>
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
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/my-dashboard/orders">{t("viewOrders")}</Link>
          </Button>
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

  function handleSubmit(values: CheckoutFormValues) {
    setPlacing(true);
    ordersApi
      .createForUser({
        items: orderItems,
        phone: values.phone.trim(),
        shippingAddress: {
          street: values.street.trim(),
          city: values.city.trim(),
          state: values.state.trim(),
          postalCode: values.postalCode.trim(),
          country: values.country.trim(),
        },
        notes: values.notes?.trim() || undefined,
      })
      .then((order) => {
        clearCart.mutate(undefined);
        toast.success(t("orderPlaced", { id: order.id }));
        setPlacedOrder(order);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="h-fit">
            <CardContent className="space-y-4 p-5">
              <h2 className="text-lg font-semibold">{t("contactTitle")}</h2>
              <div className="space-y-1 text-sm">
                <p className="font-medium">{user?.name}</p>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardContent className="space-y-4 p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {t("shippingTitle")}
              </h2>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t("phonePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("street")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("streetPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("city")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("state")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("postalCode")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("country")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("notes")}</FormLabel>
                    <FormControl>
                      <Textarea placeholder={t("notesPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

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
            <Button type="submit" className="w-full" disabled={placing}>
              {placing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {placing ? t("placing") : t("placeOrder")}
            </Button>
          </CardContent>
        </Card>
        </form>
      </Form>
    </div>
  );
}
