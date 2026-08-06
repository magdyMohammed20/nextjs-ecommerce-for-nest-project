"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Loader2, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/products/types/product-types";
import { useCart } from "../hooks/use-cart";

export function AddToCartButton({
  productId,
  outOfStock = false,
  showQuantity = false,
  className,
  product,
}: {
  productId: number;
  outOfStock?: boolean;
  showQuantity?: boolean;
  className?: string;
  product?: Product;
}) {
  const { t } = useTranslation("cart");
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [pending, setPending] = useState(false);

  async function handleAdd() {
    setPending(true);
    try {
      await addItem.mutateAsync({ productId, quantity, product });
      toast.success(t("added", { count: quantity }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("addFailed"));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}>
      {showQuantity && (
        <div className="flex items-center rounded-lg border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-12 w-10 rounded-none"
            aria-label={t("decreaseQuantity")}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
            {quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-12 w-10 rounded-none"
            aria-label={t("increaseQuantity")}
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Button size="sm" onClick={handleAdd} disabled={outOfStock || pending} className={showQuantity ? "h-12 flex-1 sm:flex-none" : ""}>
        {pending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {outOfStock ? t("unavailable") : t("addToCart")}
      </Button>
    </div>
  );
}
