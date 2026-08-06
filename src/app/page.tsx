"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, animate, motion, useInView, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  ArrowRight, ArrowUpRight, BadgeCheck, Check,
  Flame, Headphones, LifeBuoy, Menu,
  Package, RotateCcw, Search, ShieldCheck,
  ShoppingBag, Star, Truck, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { UserMenu } from "@/components/shared/user-menu";
import { SearchDropdownPanel } from "@/components/shared/search-dropdown";
import { SiteFooter } from "@/components/shared/site-footer";
import { Carousel } from "@/components/shared/carousel";
import { CartBadge } from "@/features/cart/components/cart-badge";
import { AddToCartButton } from "@/features/cart/components/add-to-cart-button";
import { useAuth } from "@/features/auth/context/auth-provider";
import { useCart } from "@/features/cart/hooks/use-cart";
import { homeApi } from "@/features/home/api/home-api";
import type { HomeResponseDto } from "@/features/home/types/home-types";
import type { Product } from "@/features/products/types/product-types";
import { ProductImage } from "@/features/products/components/product-image";
import { resolveCategoryIcon } from "@/features/categories/constants/category-icons";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: easeOut } },
};

function useReveal(margin = 0) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight - margin && rect.bottom >= 0) {
        setVisible(true);
      }
    };

    check();
    const t = window.setTimeout(check, 300);
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [margin]);

  return { ref, visible };
}

function Reveal({
  margin = 0,
  className,
  children,
}: {
  margin?: number;
  className?: string;
  children: ReactNode;
}) {
  const { ref, visible } = useReveal(margin);
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
      variants={container}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  const { ref, visible } = useReveal(-80);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? "show" : "hidden"}
      variants={container}
      className="mx-auto max-w-2xl text-center"
    >
      <motion.h2 variants={item} className="text-3xl font-bold md:text-4xl">{title}</motion.h2>
      <motion.div variants={item} className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-cyan-500" />
      {subtitle && <motion.p variants={item} className="mt-4 text-muted-foreground">{subtitle}</motion.p>}
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
      duration: 1.8, ease: "easeOut", onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return <span ref={ref} className="tabular-nums">{display.toLocaleString()}{suffix}</span>;
}

const categoryGradients = [
  "from-blue-500/25 to-indigo-500/10", "from-cyan-500/25 to-sky-500/10",
  "from-sky-500/25 to-blue-500/10", "from-indigo-500/25 to-blue-500/10",
  "from-teal-500/25 to-cyan-500/10", "from-cyan-500/25 to-blue-500/10",
];
const productGradients = [
  "from-blue-500 via-sky-400 to-cyan-400", "from-indigo-500 via-blue-400 to-cyan-400",
  "from-cyan-500 via-sky-400 to-blue-400", "from-blue-500 via-indigo-400 to-sky-400",
];
const valueIcons = [Truck, ShieldCheck, RotateCcw, LifeBuoy];
export default function LandingPage() {
  const { t } = useTranslation("home");
  const { user, isAdmin } = useAuth();
  const { addItem } = useCart();

  function handleAddToCart(productId: number | null, product?: Product) {
    if (!productId || isAdmin) return;
    addItem.mutate(
      { productId, quantity: 1, product },
      {
        onSuccess: () => toast.success(t("featured.addedToCart")),
        onError: (err) =>
          toast.error(err instanceof Error ? err.message : "Could not add to cart"),
      },
    );
  }
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [homeData, setHomeData] = useState<HomeResponseDto | null>(null);
  const { ref: viewAllRef, visible: viewAllVisible } = useReveal(0);

  useEffect(() => {
    homeApi.getHome().then(setHomeData).catch(() => {
      // Home data fails gracefully — fall back to static i18n content
    });
  }, []);

  const stats = t("stats", { returnObjects: true }) as { value: number; suffix: string; label: string }[];
  const staticCategories = t("categories.items", { returnObjects: true }) as string[];
  const featured = t("featured.items", { returnObjects: true }) as { name: string; category: string; price: number; oldPrice: number }[];
  const values = t("values.items", { returnObjects: true }) as { title: string; description: string }[];
  const testimonials = t("testimonials.items", { returnObjects: true }) as { quote: string; name: string; role: string }[];

  // Use live categories if available, else static i18n names
  const liveCategories = homeData?.categories ?? [];
  const liveFeatured = homeData?.featuredProducts ?? [];
  const liveLatest = homeData?.latestProducts ?? [];

  const categoriesList =
    liveCategories.length > 0
      ? liveCategories
      : staticCategories.map((name, i) => ({ id: i, name, slug: name.toLowerCase() }));
  const featuredList = liveFeatured.length > 0 ? liveFeatured : featured;
  const categoryCarousel = categoriesList.length > 6;
  const featuredCarousel = featuredList.length > 4;
  const latestCarousel = liveLatest.length > 4;

  function renderCategoryCard(
    cat: { id: number; name: string; icon?: string | null } | string,
    i: number,
    carousel = false,
  ) {
    const Icon = resolveCategoryIcon(typeof cat === "string" ? undefined : cat.icon, i);
    const catName = typeof cat === "string" ? cat : cat.name;
    const catHref = typeof cat === "string" ? "/products" : `/products?category=${cat.id}`;
    return (
      <motion.div
        key={i}
        variants={item}
        whileHover={{ y: -6 }}
        className={carousel ? "w-40 shrink-0 snap-start sm:w-48" : "h-full"}
      >
        <Link href={catHref} className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-5 text-center shadow-sm transition-shadow hover:shadow-md">
          <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${categoryGradients[i % categoryGradients.length]}`}>
            <Icon className="h-5 w-5 text-foreground" />
          </span>
          <span className="text-sm font-medium leading-snug">{catName}</span>
        </Link>
      </motion.div>
    );
  }

  function renderFeaturedCard(product: unknown, i: number, carousel = false) {
    const isLive = liveFeatured.length > 0;
    const p = product as {
      id?: number;
      name: string;
      price: number;
      oldPrice?: number;
      category?: { name: string } | string | null;
      imageUrl?: string | null;
    };
    const name = p.name;
    const price = Number(p.price);
    const oldPrice = isLive ? 0 : (p.oldPrice ?? 0);
    const categoryName = typeof p.category === "string" ? p.category : p.category?.name;
    const imageUrl = isLive ? (p.imageUrl ?? null) : null;
    const gradient = productGradients[i % productGradients.length];
    const liveProduct = isLive ? (product as unknown as Product) : undefined;
    return (
      <motion.div
        key={i}
        variants={item}
        whileHover={{ y: -8 }}
        className={carousel ? "w-64 shrink-0 snap-start sm:w-72" : "h-full"}
      >
        <Link href={isLive ? `/products/${p.id}` : "/products"}
          className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
          <div className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden ${imageUrl ? "" : `bg-gradient-to-br ${gradient}`}`}>
            {imageUrl ? (
              <ProductImage src={imageUrl} alt={name} className="h-full w-full object-cover" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.4),transparent_45%)]" />
                <Package className="h-16 w-16 text-white/80" />
              </>
            )}
            {oldPrice > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                {t("featured.sale")}
              </span>
            )}
            <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" />4.9
            </span>
          </div>
          <div className="flex flex-1 flex-col px-4 pt-3 pb-3">
            {categoryName && <p className="mb-1 text-xs uppercase tracking-wide text-muted-foreground">{categoryName}</p>}
            <h3 className="line-clamp-1 text-base font-semibold leading-tight">{name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-primary">${price.toFixed(2)}</span>
                {oldPrice > 0 && <span className="text-sm text-muted-foreground line-through">${oldPrice.toFixed(2)}</span>}
              </div>
              {!isAdmin && (
                <Button size="sm" className="opacity-90 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(
                      isLive && typeof p.id === "number" ? p.id : null,
                      liveProduct,
                    );
                  }}>
                  <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />{t("featured.addToCart")}
                </Button>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  const navLinks = [
    { href: "/products", label: t("nav.shop") },
    { href: "#categories", label: t("nav.categories") },
    { href: "#deals", label: t("nav.deals") },
    { href: "#testimonials", label: t("nav.testimonials") },
  ];

  function handleAnchorNav(e: ReactMouseEvent<HTMLElement>, href: string) {
    if (!href.startsWith("#")) {
      setMobileOpen(false);
      return;
    }
    e.preventDefault();
    setMobileOpen(false);
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Announcement */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary via-blue-600 to-primary px-4 py-2.5 text-center text-xs font-medium text-primary-foreground">
        <span className="relative z-10 flex items-center justify-center gap-2">
          <Flame className="h-3.5 w-3.5" />{t("announcement")}
        </span>
      </motion.div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center"><Logo /></Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <Button key={link.href} asChild variant="ghost" size="sm" onClick={(e) => handleAnchorNav(e, link.href)}>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              <Button asChild variant="ghost" size="sm"><Link href="/about">{t("nav.about", { defaultValue: "About" })}</Link></Button>
              <Button asChild variant="ghost" size="sm"><Link href="/faq">{t("nav.faq", { defaultValue: "FAQ" })}</Link></Button>
            </nav>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" aria-label={t("searchPlaceholder", { defaultValue: "Search products" })}
              onClick={() => setSearchOpen((o) => !o)}>
              <Search className="h-4 w-4" />
            </Button>
             <LanguageSwitcher /><ThemeToggle />
             <CartBadge />
             <div className="hidden items-center gap-2 sm:flex">
              {user ? (
                <UserMenu />
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm"><Link href="/login">{t("nav.signIn")}</Link></Button>
                  <Button asChild size="sm"><Link href="/register">{t("nav.getStarted")}</Link></Button>
                </>
              )}
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        <SearchDropdownPanel
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          containerClassName="max-w-7xl"
        />
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: easeOut }}
              className="overflow-hidden border-t bg-background lg:hidden">
              <div className="space-y-1 px-4 py-3">
                {navLinks.map((link) => (
                  <Button key={link.href} asChild variant="ghost" className="w-full justify-start"
                    onClick={(e) => handleAnchorNav(e, link.href)}>
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                ))}
                <div className="flex gap-2 pt-2">
                  {user ? (
                    <Button asChild variant="outline" className="flex-1" onClick={() => setMobileOpen(false)}>
                      <Link href="/profile">{t("nav.profile", { defaultValue: "My Profile" })}</Link>
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

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/25 via-cyan-500/15 to-transparent blur-3xl" />
            <div className="absolute bottom-0 -left-32 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
            <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:px-8">
            <Reveal className="max-w-xl">
              <motion.span variants={item} className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm">
                <BadgeCheck className="h-3.5 w-3.5" />{t("hero.badge")}
              </motion.span>
              <motion.h1 variants={item} className="mt-6 text-4xl font-bold leading-[1.1] md:text-6xl">
                {t("hero.titleA")}{" "}
                <span className="bg-gradient-to-r from-primary via-cyan-600 to-sky-600 dark:via-cyan-400 dark:to-sky-300 bg-clip-text text-transparent">
                  {t("hero.titleHighlight")}
                </span>
              </motion.h1>
              <motion.p variants={item} className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {t("hero.subtitle")}
              </motion.p>
              <motion.div variants={item} className="mt-6 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/register">{t("hero.ctaShop")}<ArrowRight className="ms-2 h-4 w-4 rtl:-scale-x-100" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/products">{t("hero.ctaBrowse")}</Link>
                </Button>
              </motion.div>
              <motion.div variants={item} className="mt-8 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["from-blue-500 to-indigo-500", "from-cyan-500 to-sky-500", "from-sky-500 to-blue-500", "from-indigo-500 to-blue-500"].map((g, i) => (
                    <span key={i} className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-gradient-to-br text-[10px] font-bold text-white ${g}`}>
                      {["SK", "OH", "LM", "AJ"][i]}
                    </span>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold">{t("hero.trustRating")}</span>
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-muted-foreground">{t("hero.trustLabel")}</p>
                </div>
              </motion.div>
            </Reveal>
            {/* Hero visual */}
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.2 }} className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border bg-gradient-to-br from-blue-600 via-indigo-500 to-cyan-500 p-1 shadow-2xl shadow-primary/20">
                <div className="relative grid h-[26rem] place-items-center overflow-hidden rounded-[calc(2rem-4px)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
                  <motion.div animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-44 w-44 items-center justify-center rounded-3xl bg-white/95 shadow-2xl backdrop-blur">
                    <div className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
                      <Flame className="h-6 w-6" />
                    </div>
                    <Headphones className="h-20 w-20 text-blue-600" />
                  </motion.div>
                  <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                    className="absolute left-4 top-8 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"><Truck className="h-4 w-4" /></span>
                    <p className="text-xs font-semibold text-slate-900">{t("hero.freeShipping")}</p>
                  </motion.div>
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                    className="absolute bottom-8 right-4 flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-2 shadow-lg">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><ShieldCheck className="h-4 w-4" /></span>
                    <p className="text-xs font-semibold text-slate-900">{t("hero.securePay")}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y bg-muted/40">
          <Reveal margin={-60} className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={item} className="text-center">
                <p className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </Reveal>
        </section>

        {/* Categories */}
        <section id="categories" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title={t("categories.title")} subtitle={t("categories.subtitle")} />
          {categoryCarousel ? (
            <Reveal margin={-80} className="mt-12">
              <Carousel>{categoriesList.map((cat, i) => renderCategoryCard(cat, i, true))}</Carousel>
            </Reveal>
          ) : (
            <Reveal margin={-80} className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categoriesList.map((cat, i) => renderCategoryCard(cat, i))}
            </Reveal>
          )}
        </section>

        {/* Featured products */}
        <section id="deals" className="bg-muted/40 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title={t("featured.title")} subtitle={t("featured.subtitle")} />
            {featuredCarousel ? (
              <Reveal margin={-80} className="mt-12">
                <Carousel>{featuredList.map((product, i) => renderFeaturedCard(product, i, true))}</Carousel>
              </Reveal>
            ) : (
              <Reveal margin={-80} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {featuredList.map((product, i) => renderFeaturedCard(product, i))}
              </Reveal>
            )}
            <motion.div ref={viewAllRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: viewAllVisible ? 1 : 0, y: viewAllVisible ? 0 : 20 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }} className="mt-12 text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/products">{t("featured.viewAll")}<ArrowUpRight className="ms-2 h-4 w-4 rtl:-scale-x-100" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Latest products */}
        {liveLatest.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
            <SectionHeading title={t("latest.title", { defaultValue: "Latest arrivals" })} subtitle={t("latest.subtitle", { defaultValue: "Fresh additions to the catalog" })} />
            {latestCarousel ? (
              <Reveal margin={-80} className="mt-12">
                <Carousel>
                  {liveLatest.slice(0, 8).map((product, i) => (
                    <motion.div key={product.id} variants={item} whileHover={{ y: -8 }} className="w-64 shrink-0 snap-start sm:w-72">
                      <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
                        <Link href={`/products/${product.id}`} className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden ${product.imageUrl ? "" : `bg-gradient-to-br ${productGradients[i % productGradients.length]}`}`}>
                          {product.imageUrl ? (
                            <ProductImage src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-16 w-16 text-white/80" />
                          )}
                        </Link>
                        <div className="flex flex-1 flex-col px-4 pt-3 pb-3">
                          {product.category?.name && (
                            <Link href={`/products?category=${product.category.id}`} className="mb-1 text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground">
                              {product.category.name}
                            </Link>
                          )}
                          <Link href={`/products/${product.id}`} className="line-clamp-1 text-base font-semibold leading-tight hover:text-primary">
                            {product.name}
                          </Link>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                            <AddToCartButton productId={product.id} product={product} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </Carousel>
              </Reveal>
            ) : (
              <Reveal margin={-80} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {liveLatest.slice(0, 8).map((product, i) => (
                  <motion.div key={product.id} variants={item} whileHover={{ y: -8 }} className="h-full">
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-xl">
                      <Link href={`/products/${product.id}`} className={`relative flex aspect-[4/3] items-center justify-center overflow-hidden ${product.imageUrl ? "" : `bg-gradient-to-br ${productGradients[i % productGradients.length]}`}`}>
                        {product.imageUrl ? (
                          <ProductImage src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-16 w-16 text-white/80" />
                        )}
                      </Link>
                      <div className="flex flex-1 flex-col px-4 pt-3 pb-3">
                        {product.category?.name && (
                          <Link href={`/products?category=${product.category.id}`} className="mb-1 text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground">
                            {product.category.name}
                          </Link>
                        )}
                        <Link href={`/products/${product.id}`} className="line-clamp-1 text-base font-semibold leading-tight hover:text-primary">
                          {product.name}
                        </Link>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-lg font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                          <AddToCartButton productId={product.id} product={product} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </Reveal>
            )}
          </section>
        )}

        {/* Value props */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading title={t("values.title")} subtitle={t("values.subtitle")} />
          <Reveal margin={-80} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = valueIcons[i] ?? Check;
              return (
                <motion.div key={v.title} variants={item} className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                </motion.div>
              );
            })}
          </Reveal>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="bg-muted/40 py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading title={t("testimonials.title")} subtitle={t("testimonials.subtitle")} />
            <Reveal margin={-80} className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.map((tm) => (
                <motion.div key={tm.name} variants={item}
                  className="rounded-2xl border bg-card p-6 shadow-sm">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">&ldquo;{tm.quote}&rdquo;</p>
                  <div className="mt-4">
                    <p className="font-semibold text-sm">{tm.name}</p>
                    <p className="text-xs text-muted-foreground">{tm.role}</p>
                  </div>
                </motion.div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <Reveal className="rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-cyan-500 p-10 text-center text-white shadow-2xl dark:from-blue-700">
            <motion.h2 variants={item} className="text-3xl font-bold md:text-4xl">{t("cta.title")}</motion.h2>
            <motion.p variants={item} className="mt-4 text-lg text-white/80">{t("cta.subtitle")}</motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/register">{t("cta.action")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/login">{t("cta.action2")}</Link>
              </Button>
            </motion.div>
          </Reveal>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
