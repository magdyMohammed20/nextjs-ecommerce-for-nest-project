"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ProductDetails } from "@/features/products/components/product-details";

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const { t } = useTranslation("products");
  const productId = Number.parseInt(params.id, 10);

  if (Number.isNaN(productId)) {
    return (
      <div className="mx-auto max-w-md p-16 text-center text-sm text-muted-foreground">
        {t("invalidProductId")}
      </div>
    );
  }

  return <ProductDetails productId={productId} />;
}
