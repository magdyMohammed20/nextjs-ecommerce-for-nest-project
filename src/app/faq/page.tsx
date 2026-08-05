"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

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

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        <span className="font-semibold leading-snug">{question}</span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  const { t } = useTranslation("faq");
  const items = t("items", { returnObjects: true }) as { question: string; answer: string }[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref: contactRef, visible: contactVisible } = useReveal(0);

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
        <section className="border-b bg-gradient-to-br from-primary/10 via-cyan-500/5 to-transparent py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <Reveal>
              <motion.div variants={item} className="flex justify-center mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <HelpCircle className="h-7 w-7" />
                </div>
              </motion.div>
              <motion.h1 variants={item} className="text-4xl font-bold leading-tight md:text-5xl">{t("title")}</motion.h1>
              <motion.div variants={item} className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-primary to-cyan-500" />
              <motion.p variants={item} className="mt-5 text-muted-foreground">{t("subtitle")}</motion.p>
            </Reveal>
          </div>
        </section>

        {/* Accordion */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal margin={-60} className="space-y-3">
            {items.map((faq, i) => (
              <motion.div key={i} variants={item}>
                <AccordionItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </motion.div>
            ))}
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
    </div>
  );
}
