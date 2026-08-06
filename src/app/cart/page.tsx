"use client";

import { useTranslation } from "react-i18next";
import { SiteNavbar } from "@/components/shared/site-navbar";
import { SiteFooter } from "@/components/shared/site-footer";
import { PageHero } from "@/components/shared/page-hero";
import { CartPage } from "@/features/cart/components/cart-page";

export default function CartPageClient() {
  const { t } = useTranslation("cart");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />
      <main className="flex-1">
        <PageHero>
          <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">{t("title")}</h1>
            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400" />
            <p className="mt-5 text-white/85">{t("subtitle")}</p>
          </div>
        </PageHero>
        <section className="w-full px-4 py-16 sm:px-6 lg:px-8">
          <CartPage />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}