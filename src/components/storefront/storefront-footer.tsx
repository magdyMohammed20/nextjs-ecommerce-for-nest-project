"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/shared/logo";

export function StorefrontFooter() {
  const { t } = useTranslation("storefront");

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:px-6 sm:text-start lg:px-8">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>
        <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link href="/products" className="transition-colors hover:text-foreground">
            {t("nav.shop")}
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground">
            {t("nav.about")}
          </Link>
          <Link href="/faq" className="transition-colors hover:text-foreground">
            {t("nav.faq")}
          </Link>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ShopWave. {t("footer.rights")}
      </div>
    </footer>
  );
}
