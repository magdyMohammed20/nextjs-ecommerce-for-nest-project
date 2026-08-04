"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation("common");

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted/40 px-4 py-12">
      <div className="absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-80 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="absolute right-4 top-4 flex items-center gap-1.5">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
          >
            <Logo showText={false} />
          </Link>
          <div>
            <p className="text-lg font-semibold">{t("appName")}</p>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
