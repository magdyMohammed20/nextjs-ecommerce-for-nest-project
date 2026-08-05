"use client";

import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function ShopWaveMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M9 9.4a3 3 0 0 1 6 0"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M6.7 11.2h10.6l-1 7.6a1.5 1.5 0 0 1-1.48 1.2H9.18a1.5 1.5 0 0 1-1.48-1.2l-1-7.6Z"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <path
        d="M6.2 17.3c1.4 0 1.4-1 2.8-1s1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface LogoProps {
  showText?: boolean;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function Logo({
  showText = true,
  className,
  iconClassName,
  textClassName,
}: LogoProps) {
  const { t } = useTranslation("common");

  return (
    <span className={cn("flex items-center gap-2 font-heading", className)}>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-500 text-primary-foreground shadow-sm",
          iconClassName,
        )}
      >
        <ShopWaveMark className="h-5 w-5" />
      </span>
      {showText && (
        <span className={cn("text-lg font-bold", textClassName)}>{t("appName")}</span>
      )}
    </span>
  );
}
