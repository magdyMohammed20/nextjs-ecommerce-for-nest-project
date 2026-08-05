"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, BadgeCheck, Leaf, ShieldCheck, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
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

const valueIcons = [Star, ShieldCheck, BadgeCheck, Leaf];

export default function AboutPage() {
  const { t } = useTranslation("about");
  const values = t("values.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mini header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/"><Logo /></Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/"><ArrowLeft className="me-1.5 h-4 w-4 rtl:-scale-x-100" />{t("nav.backHome")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary/10 via-cyan-500/5 to-transparent py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <motion.span variants={item} className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-primary shadow-sm">
                <BadgeCheck className="h-3.5 w-3.5" />ShopWave
              </motion.span>
              <motion.h1 variants={item} className="mt-6 text-4xl font-bold leading-tight md:text-5xl">{t("title")}</motion.h1>
              <motion.div variants={item} className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-cyan-500" />
              <motion.p variants={item} className="mt-6 text-lg text-muted-foreground">{t("subtitle")}</motion.p>
            </Reveal>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal margin={-80} className="grid gap-8 md:grid-cols-2">
            <motion.div variants={item} className="rounded-2xl border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold">{t("mission.title")}</h2>
              <div className="mt-3 h-1 w-10 rounded-full bg-primary" />
              <p className="mt-4 text-muted-foreground leading-relaxed">{t("mission.body")}</p>
            </motion.div>
            <motion.div variants={item} className="rounded-2xl border bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold">{t("story.title")}</h2>
              <div className="mt-3 h-1 w-10 rounded-full bg-cyan-500" />
              <p className="mt-4 text-muted-foreground leading-relaxed">{t("story.body")}</p>
            </motion.div>
          </Reveal>
        </section>

        {/* Values */}
        <section className="bg-muted/40 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Reveal margin={-80}>
              <motion.h2 variants={item} className="text-2xl font-bold text-center">{t("values.title")}</motion.h2>
              <motion.div variants={item} className="mx-auto mt-3 h-1 w-10 rounded-full bg-gradient-to-r from-primary to-cyan-500" />
              <motion.div variants={container} className="mt-10 grid gap-6 sm:grid-cols-2">
                {values.map((v, i) => {
                  const Icon = valueIcons[i] ?? Star;
                  return (
                    <motion.div key={v.title} variants={item} className="flex gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{v.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{v.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </Reveal>
          </div>
        </section>

        {/* Team + CTA */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal className="rounded-3xl bg-gradient-to-br from-primary via-blue-600 to-cyan-500 p-10 text-center text-white shadow-2xl dark:from-blue-700">
            <motion.div variants={item} className="flex justify-center mb-4">
              <Users className="h-10 w-10 text-white/80" />
            </motion.div>
            <motion.h2 variants={item} className="text-2xl font-bold">{t("team.title")}</motion.h2>
            <motion.p variants={item} className="mt-3 text-white/80 leading-relaxed">{t("team.body")}</motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="/products">{t("cta.action")}</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                <Link href="/faq">{t("cta.action2")}</Link>
              </Button>
            </motion.div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
