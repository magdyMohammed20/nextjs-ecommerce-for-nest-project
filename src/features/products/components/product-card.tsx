"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Product } from "../types/product-types";
import { ProductImage } from "./product-image";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation("products");
  const outOfStock = product.quantity === 0;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <Card className="overflow-hidden transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative">
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
        <div className="space-y-2 p-4">
          <h3 className="line-clamp-1 font-semibold leading-tight">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {product.description ?? t("noDescription")}
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-primary">
              ${Number(product.price).toFixed(2)}
            </span>
            {outOfStock && (
              <span className="text-xs font-medium text-destructive">{t("unavailable")}</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
