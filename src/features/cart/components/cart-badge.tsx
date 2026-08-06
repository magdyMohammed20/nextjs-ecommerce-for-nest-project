"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "../hooks/use-cart";

export function CartBadge() {
  const { t } = useTranslation("common");
  const { totalItems } = useCart();

  return (
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="relative"
      aria-label={t("nav.cart")}
    >
      <Link href="/cart">
        <ShoppingCart className="h-4.5 w-4.5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
