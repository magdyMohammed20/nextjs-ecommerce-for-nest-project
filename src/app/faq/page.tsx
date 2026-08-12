"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNavbar } from "@/components/shared/site-navbar";
import { SiteFooter } from "@/components/shared/site-footer";
import { PageHero } from "@/components/shared/page-hero";
import { FaqList } from "@/features/faq/components/faq-list";
import { faqApi } from "@/features/faq/api/faq-api";
import type { Faq } from "@/features/faq/types/faq-types";
import { SkeletonList } from "@/components/shared/skeletons";

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
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

function toLocalizedItems(faqs: Faq[], isArabic: boolean) {
  return faqs.map((faq) => ({
    question: isArabic ? faq.questionAr : faq.questionEn,
    answer: isArabic ? faq.answerAr : faq.answerEn,
  }));
}

export default function FaqPage() {
  const { t, i18n } = useTranslation("faq");
  const isArabic = i18n.language?.toLowerCase().startsWith("ar") ?? false;
  const staticItems = useMemo(
    () => t("items", { returnObjects: true }) as {
      question: string;
      answer: string;
    }[],
    [t],
  );
  const [liveItems, setLiveItems] = useState<{
    question: string;
    answer: string;
  }[] | null>(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { ref: contactRef, visible: contactVisible } = useReveal(0);

  useEffect(() => {
    let ignore = false;

    faqApi
      .getActive()
      .then((faqs) => {
        const localized = toLocalizedItems(faqs, isArabic);
        if (!ignore) {
          setLiveItems(localized);
          setIsEmpty(localized.length === 0);
        }
      })
      .catch(() => {
        if (!ignore) {
          setLiveItems(staticItems);
          setIsEmpty(false);
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isArabic, t, staticItems]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* Hero */}
        <PageHero>
          <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <Reveal>
              <motion.div variants={item} className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-200 backdrop-blur border border-white/20">
                  <HelpCircle className="h-7 w-7" />
                </div>
              </motion.div>
              <motion.h1 variants={item} className="text-4xl font-bold leading-tight text-white md:text-5xl">{t("title")}</motion.h1>
              <motion.div variants={item} className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400" />
              <motion.p variants={item} className="mt-5 text-white/85">{t("subtitle")}</motion.p>
            </Reveal>
          </div>
        </PageHero>

        {/* Accordion */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal margin={-60}>
            {isLoading ? (
              <SkeletonList count={5} height="h-16" rowClassName="rounded-2xl" />
            ) : isEmpty ? (
              <motion.div variants={item} className="flex flex-col items-center gap-4 rounded-3xl border bg-card px-6 py-14 text-center shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                  <HelpCircle className="h-7 w-7" />
                </div>
                <h2 className="text-xl font-bold">{t("emptyTitle")}</h2>
                <p className="max-w-md text-sm text-muted-foreground">{t("emptyDescription")}</p>
                <Button asChild size="lg" className="mt-2">
                  <Link href="mailto:support@shopwave.com">{t("emptyCta")}</Link>
                </Button>
              </motion.div>
            ) : (
              <FaqList items={liveItems ?? staticItems} />
            )}
          </Reveal>
        </section>

        {/* Still have questions */}
        <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div ref={contactRef} initial={{ opacity: 0, y: 24 }} animate={{ opacity: contactVisible ? 1 : 0, y: contactVisible ? 0 : 24 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="flex flex-col items-center gap-4 rounded-3xl border bg-card p-10 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">{t("stillHaveQuestions")}</h2>
            <p className="max-w-sm text-sm text-muted-foreground">{t("contactBody")}</p>
            <Button asChild size="lg">
              <Link href="mailto:support@shopwave.com">{t("contactUs")}</Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
