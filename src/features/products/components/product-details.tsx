"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Hash,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { productsApi } from "../api/products-api";
import type { Product } from "../types/product-types";
import { useAuth } from "@/features/auth/context/auth-provider";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { ProductImage } from "./product-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

interface ProductDetailsProps {
  productId: number;
}

function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
        <div className="space-y-5">
          <div className="space-y-3">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-36 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductDetails({ productId }: ProductDetailsProps) {
  const { isAdmin } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("products");

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    productsApi
      .getById(productId)
      .then((loaded) => {
        if (!ignore) {
          setProduct(loaded);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setNotFound(true);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [productId]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await productsApi.remove(productId);
      toast.success(t("toasts.productDeleted", { ns: "common" }));
      router.push("/products");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.failedToDeleteProduct", { ns: "common" }),
      );
      setIsDeleting(false);
    }
  }

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-16 text-center">
        <div className="rounded-full bg-muted p-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t("productNotFoundTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("productNotFoundSubtitle")}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/products">
            <ArrowLeft className="me-2 h-4 w-4 rtl:-scale-x-100" />
            {t("backToProducts")}
          </Link>
        </Button>
      </div>
    );
  }

  const outOfStock = product.quantity === 0;
  const price = Number(product.price).toFixed(2);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/products">
            <ArrowLeft className="me-1 h-4 w-4 rtl:-scale-x-100" />
            {t("backToProducts")}
          </Link>
        </Button>

        {isAdmin && (
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href={`/products/${product.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                {t("editProduct")}
              </Link>
            </Button>
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </Button>
          </div>
        )}
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="overflow-hidden rounded-2xl border bg-muted/40 shadow-sm">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-bold text-primary">${price}</span>
              <Badge variant={outOfStock ? "destructive" : "secondary"} className="px-2.5 py-1">
                {outOfStock ? (
                  t("outOfStock")
                ) : (
                  <span className="flex items-center gap-1">
                    <Boxes className="h-3 w-3" />
                    {t("inStock", { quantity: product.quantity })}
                  </span>
                )}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("description")}
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              {product.description ?? t("noDescriptionProvided")}
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("productDetails")}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl bg-background p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Hash className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{t("productID")}</p>
                  <p className="text-sm font-medium">{product.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-background p-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <CircleDollarSign className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{t("price")}</p>
                  <p className="text-sm font-medium">${price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-background p-3 sm:col-span-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Boxes className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{t("availability")}</p>
                  <p className="text-sm font-medium">
                    {outOfStock ? t("outOfStock") : t("inStockUnits", { quantity: product.quantity })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <>
              <AddToCartButton productId={product.id} outOfStock={outOfStock} showQuantity />
              <Button asChild variant="outline" className="mt-auto self-start">
                <Link href="/products">
                  {t("browseMore")}
                  <ArrowUpRight className="ms-2 h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { name: product.name })}
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
              {isDeleting ? t("actions.deleting", { ns: "common" }) : t("actions.delete", { ns: "common" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
