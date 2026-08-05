"use client";

import type { FormEvent } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AtSign, Globe, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/logo";

const socialIcons = [Globe, MessageCircle, Send, AtSign];

export function SiteFooter() {
  const { t } = useTranslation("home");

  const shopLinks = t("footer.shopLinks", { returnObjects: true }) as string[];
  const supportLinks = t("footer.supportLinks", { returnObjects: true }) as string[];

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success(t("footer.subscribed"));
    e.currentTarget.reset();
  }

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-5">
          <div>
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="mt-4 flex gap-3">
              {socialIcons.map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm">{t("footer.shopTitle")}</p>
            <ul className="mt-3 space-y-2">
              {shopLinks.map((l) => (
                <li key={l}><Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-sm">{t("footer.supportTitle")}</p>
            <ul className="mt-3 space-y-2">
              {supportLinks.map((l, i) => (
                <li key={l}>
                  <Link href={i === 3 ? "/faq" : "#"} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
                </li>
              ))}
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About us</Link></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold text-sm">{t("footer.newsTitle")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("footer.newsSubtitle")}</p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <Input type="email" placeholder={t("footer.emailPlaceholder")} className="flex-1 text-sm" required />
              <Button type="submit" size="default">{t("footer.subscribe")}</Button>
            </form>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ShopWave. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
