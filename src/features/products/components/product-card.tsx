"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { type Product } from "../types/product-types";
import { ProductImage } from "./product-image";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation("products");
  const outOfStock = product.quantity === 0;

  return (
    <div className="flex h-full flex-col">
      <Link href={`/products/${product.id}`} className="group block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
          <div className="relative shrink-0">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <Badge
              variant={outOfStock ? "destructive" : "secondary"}
              className="absolute right-3 top-3"
            >
              {outOfStock ? t("outOfStock") : t("inStock", { quantity: product.quantity })}
            </Badge>
          </div>
          <div className="flex flex-1 flex-col gap-2.5 px-5 pb-5">
            <h3 className="line-clamp-1 text-base font-semibold leading-tight">{product.name}</h3>
            <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
              {product.description ?? t("noDescription")}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xl font-bold text-primary">
                ${Number(product.price).toFixed(2)}
              </span>
              {outOfStock && (
                <span className="text-xs font-medium text-destructive">{t("unavailable")}</span>
              )}
            </div>
          </div>
        </Card>
      </Link>
      <div className="p-3 pt-0" onClick={(e) => e.preventDefault()}>
        <AddToCartButton productId={product.id} outOfStock={outOfStock} />
      </div>
    </div>
  );
}
