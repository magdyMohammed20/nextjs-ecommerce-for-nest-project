"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, animate, motion, useInView, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Backpack,
  BadgeCheck,
  BookOpen,
  Check,
  Flame,
  Footprints,
  Globe,
  Headphones,
  Lamp,
  LifeBuoy,
  Menu,
  MessageCircle,
  Package,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
};

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      className="mx-auto max-w-2xl text-center"
    >
      <motion.h2 variants={item} className="text-3xl font-bold md:text-4xl">
        {title}
      </motion.h2>
      <motion.div
        variants={item}
        className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-fuchsia-500"
      />
      {subtitle && (
        <motion.p variants={item} className="mt-4 text-muted-foreground">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

function StatCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const categoryIcons = [Headphones, Shirt, Lamp, Sparkles, Footprints, BookOpen];
const categoryGradients = [
  "from-violet-500/25 to-fuchsia-500/10",
  "from-sky-500/25 to-cyan-500/10",
  "from-amber-500/25 to-orange-500/10",
  "from-rose-500/25 to-pink-500/10",
  "from-emerald-500/25 to-teal-500/10",
  "from-indigo-500/25 to-blue-500/10",
];

const productIcons = [Headphones, Footprints, Lamp, Backpack];
const productGradients = [
  "from-violet-500 via-purple-400 to-fuchsia-400",
  "from-sky-500 via-cyan-400 to-teal-400",
  "from-amber-400 via-orange-400 to-rose-400",
  "from-rose-500 via-pink-400 to-fuchsia-400",
];

const valueIcons = [Truck, ShieldCheck, RotateCcw, LifeBuoy];

const socialIcons = [Globe, MessageCircle, Send, AtSign];

export default function LandingPage() {
  const { t } = useTranslation("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  const stats = t("stats", { returnObjects: true }) as {
    value: number;
    suffix: string;
    label: string;
  }[];
  const categories = t("categories.items", { returnObjects: true }) as string[];
  const featured = t("featured.items", { returnObjects: true }) as {
    name: string;
    category: string;
    price: number;
    oldPrice: number;
  }[];
  const values = t("values.items", { returnObjects: true }) as {
    title: string;
    description: string;
  }[];
  const testimonials = t("testimonials.items", { returnObjects: true }) as {
    quote: string;
    name: string;
    role: string;
  }[];
  const shopLinks = t("footer.shopLinks", { returnObjects: true }) as string[];
  const supportLinks = t("footer.supportLinks", { returnObjects: true }) as string[];

  const navLinks = [
    { href: "/products", label: t("nav.shop") },
    { href: "#categories", label: t("nav.categories") },
    { href: "#deals", label: t("nav.deals") },
    { href: "#testimonials", label: t("nav.testimonials") },
  ];

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success(t("footer.subscribed"));
    e.currentTarget.reset();
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Announcement bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary via-fuchsia-600 to-primary px-4 py-2.5 text-center text-xs font-medium text-primary-foreground"
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
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">{t("nav.signIn")}</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">{t("nav.getStarted")}</Link>
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
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
                  <Button asChild variant="outline" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Link href="/login">{t("nav.signIn")}</Link>
                  </Button>
                  <Button asChild className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Link href="/register">{t("nav.getStarted")}</Link>
                  </Button>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-fuchsia-500/15 to-transparent blur-3xl" />
            <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
            <motion.div
              initial="hidden"
              animate="show"
              variants={container}
              className="max-w-xl"
            >
              <motion.span
                variants={item}
                className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {t("hero.badge")}
              </motion.span>
              <motion.h1 variants={item} className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl">
                {t("hero.titleA")}{" "}
                <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
              </motion.h1>
              <motion.p variants={item} className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {t("hero.subtitle")}
              </motion.p>
              <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/register">
                    {t("hero.ctaShop")}
                    <ArrowRight className="ms-2 h-4 w-4 rtl:-scale-x-100" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/products">
                    {t("hero.ctaBrowse")}
                  </Link>
                </Button>
              </motion.div>
              <motion.div variants={item} className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["from-violet-500 to-fuchsia-500", "from-sky-500 to-cyan-500", "from-amber-400 to-orange-500", "from-rose-500 to-pink-500"].map(
                    (gradient, i) => (
                      <span
                        key={i}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br text-[10px] font-bold text-white ${gradient}`}
                      >
                        {["SK", "OH", "LM", "AJ"][i]}
                      </span>
                    ),
                  )}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{t("hero.trustRating")}</span>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{t("hero.trustLabel")}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 p-1 shadow-2xl shadow-primary/20">
                <div className="relative grid h-[26rem] place-items-center overflow-hidden rounded-[calc(2rem-4px)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />
                  <motion.div
                    animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-44 w-44 items-center justify-center rounded-3xl bg-white/95 shadow-2xl backdrop-blur"
                  >
                    <div className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                      <Flame className="h-6 w-6" />
                    </div>
                    <Headphones className="h-20 w-20 text-violet-600" />
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="absolute left-4 top-8 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                      <Truck className="h-4 w-4" />
                    </span>
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">{t("hero.freeShipping")}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute bottom-8 right-4 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                      <ShieldCheck className="h-4 w-4" />
                    </span>
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">{t("hero.securePay")}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                    className="absolute bottom-6 left-6 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow-lg"
                  >
                    <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    {t("hero.hotDrop")}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-muted/40">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={container}
            className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            title={t("categories.title")}
            subtitle={t("categories.subtitle")}
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
            className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
          >
            {categories.map((category, i) => {
              const Icon = categoryIcons[i] ?? Package;
              return (
                <motion.div key={category} variants={item} whileHover={{ y: -6 }}>
                  <Link
                    href="/products"
                    className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-md"
                  >
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${categoryGradients[i] ?? categoryGradients[0]}`}
                    >
                      <Icon className="h-5.5 w-5.5 text-foreground" />
                    </span>
                    <span className="text-sm font-medium leading-snug">{category}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Featured products */}
        <section className="bg-muted/40 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              title={t("featured.title")}
              subtitle={t("featured.subtitle")}
            />
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={container}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {featured.map((product, i) => {
                const Icon = productIcons[i] ?? Package;
                return (
                  <motion.div key={product.name} variants={item} whileHover={{ y: -8 }}>
                    <Link
                      href="/products"
                      className="group block overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl"
                    >
                      <div
                        className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gradient-to-br ${productGradients[i] ?? productGradients[0]}`}
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.4),transparent_45%)]" />
                        <motion.div
                          whileHover={{ scale: 1.12, rotate: 6 }}
                          transition={{ duration: 0.4, ease: easeOut }}
                          className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/90 shadow-xl backdrop-blur"
                        >
                          <Icon className="h-9 w-9 text-violet-600" />
                        </motion.div>
                        {product.oldPrice > 0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                            {t("featured.sale")}
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                          <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                          4.9
                        </span>
                      </div>
                      <div className="space-y-2 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {product.category}
                        </p>
                        <h3 className="line-clamp-1 font-heading text-base font-semibold leading-snug">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-primary">
                              ${product.price.toFixed(2)}
                            </span>
                            {product.oldPrice > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.oldPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="opacity-90 transition-opacity group-hover:opacity-100"
                            onClick={(e) => {
                              e.preventDefault();
                              toast.success(t("featured.addedToCart"));
                            }}
                          >
                            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                            {t("featured.addToCart")}
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
              className="mt-12 text-center"
            >
              <Button asChild variant="outline" size="lg">
                <Link href="/products">
                    {t("featured.viewAll")}
                    <ArrowUpRight className="ms-2 h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Value props */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            title={t("values.title")}
            subtitle={t("values.subtitle")}
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {values.map((value, i) => {
              const Icon = valueIcons[i] ?? Check;
              return (
                <motion.div
                  key={value.title}
                  variants={item}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border bg-card p-6 shadow-sm"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-fuchsia-500/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-base font-semibold">{value.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Promo banner */}
        <section id="deals" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-primary via-fuchsia-600 to-rose-500 px-6 py-16 text-center text-primary-foreground shadow-2xl shadow-primary/20 sm:px-12 lg:py-20"
          >
            <div className="absolute -top-24 -left-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
            <div className="absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold backdrop-blur"
            >
              <Flame className="h-3.5 w-3.5" />
              {t("promo.badge")}
            </motion.span>
            <h2 className="relative mx-auto mt-5 max-w-2xl text-3xl font-bold md:text-5xl">
              {t("promo.title")}
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/90">
              {t("promo.subtitle")}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative mt-8 inline-flex"
            >
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link href="/products">
                    {t("promo.cta")}
                    <ArrowRight className="ms-2 h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            title={t("testimonials.title")}
            subtitle={t("testimonials.subtitle")}
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={container}
            className="mt-12 grid gap-6 md:grid-cols-3"
          >
            {testimonials.map((tst) => (
              <motion.figure
                key={tst.name}
                variants={item}
                whileHover={{ y: -6 }}
                className="flex flex-col rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{tst.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-fuchsia-600 text-sm font-bold text-primary-foreground">
                    {tst.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{tst.name}</p>
                    <p className="text-xs text-muted-foreground">{tst.role}</p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </section>

        {/* CTA */}
        <section className="border-t bg-muted/40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8"
          >
            <h2 className="text-3xl font-bold md:text-4xl">{t("cta.title")}</h2>
            <p className="max-w-xl text-muted-foreground">{t("cta.subtitle")}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                    {t("cta.action")}
                    <ArrowRight className="ms-2 h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">{t("cta.action2")}</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="mt-5 flex items-center gap-2">
              {socialIcons.map((Icon, i) => (
                <Button key={i} variant="outline" size="icon" aria-label="social link">
                  <Icon className="h-4 w-4 rtl:-scale-x-100" />
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.shopTitle")}</h3>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((label) => (
                <li key={label}>
                  <Link
                    href="/products"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.supportTitle")}</h3>
            <ul className="mt-4 space-y-2.5">
              {supportLinks.map((label) => (
                <li key={label}>
                  <Link
                    href="/login"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">{t("footer.newsTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("footer.newsSubtitle")}</p>
            <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
              <Input
                type="email"
                required
                placeholder={t("footer.emailPlaceholder")}
                aria-label={t("footer.emailPlaceholder")}
                className="h-10"
              />
              <Button type="submit" className="h-10 shrink-0">
                {t("footer.subscribe")}
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
            <p>
              © {new Date().getFullYear()} {t("appName", { ns: "common" })}. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/products" className="hover:text-foreground">
                {t("nav.shop")}
              </Link>
              <Link href="#categories" className="hover:text-foreground">
                {t("nav.categories")}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
