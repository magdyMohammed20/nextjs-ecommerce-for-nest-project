"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Flame, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserMenu } from "@/components/shared/user-menu";
import { CartBadge } from "@/features/cart/components/cart-badge";
import { useAuth } from "@/features/auth/context/auth-provider";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function SiteNavbar() {
  const { t } = useTranslation("home");
  const { user } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/products", label: t("nav.shop") },
    { href: "/#categories", label: t("nav.categories") },
    { href: "/#deals", label: t("nav.deals") },
    { href: "/#testimonials", label: t("nav.testimonials") },
    { href: "/about", label: t("nav.about", { defaultValue: "About" }) },
    { href: "/faq", label: t("nav.faq", { defaultValue: "FAQ" }) },
  ];

  function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <>
      {/* Announcement */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-primary px-4 py-2.5 text-center text-xs font-medium text-primary-foreground"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Flame className="h-3.5 w-3.5" />
          {t("announcement")}
        </span>
      </motion.div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" size="sm">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <Button asChild variant="ghost" size="icon" aria-label={t("nav.shop")}>
              <Link href="/products">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
            <CartBadge />
            <div className="hidden items-center gap-2 sm:flex">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">{t("nav.signIn")}</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/register">{t("nav.getStarted")}</Link>
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
              className="overflow-hidden border-t bg-background lg:hidden"
            >
              <div className="space-y-1 px-4 py-3">
                <form onSubmit={handleSearch} className="flex gap-2 pb-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("hero.searchPlaceholder", { defaultValue: "Search…" })}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" variant="outline" aria-label="Search">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
                {navLinks.map((link) => (
                  <Button
                    key={link.href}
                    asChild
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
                <div className="flex gap-2 pt-2">
                  {user ? (
                    <Button asChild variant="outline" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Link href="/profile">
                        {t("nav.profile", { defaultValue: "My Profile" })}
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="outline" className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Link href="/login">{t("nav.signIn")}</Link>
                      </Button>
                      <Button asChild className="flex-1" onClick={() => setMobileOpen(false)}>
                        <Link href="/register">{t("nav.getStarted")}</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}