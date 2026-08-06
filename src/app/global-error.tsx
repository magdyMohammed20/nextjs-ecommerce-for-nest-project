"use client";

import { TriangleAlert } from "lucide-react";
import i18n from "@/lib/i18n";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const t = (key: string) => i18n.t(key, { ns: "common" });

  return (
    <html lang={i18n.language === "ar" ? "ar" : "en"} dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <body className="flex min-h-dvh flex-col bg-background font-sans text-foreground antialiased">
        <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-muted/40 px-4 py-16">
          <div className="absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 left-1/4 h-80 w-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="rounded-full bg-destructive/10 p-5 text-destructive">
              <TriangleAlert className="h-10 w-10" />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-primary">
              {t("errors.serverErrorStatus")}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t("errors.serverErrorTitle")}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {t("errors.serverErrorDescription")}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:translate-y-px"
              >
                {t("errors.tryAgain")}
              </button>
            </div>

            <p className="mt-12 text-xs tabular-nums text-muted-foreground">
              {error.digest
                ? i18n.t("errors.digest", { ns: "common", digest: error.digest })
                : " "}
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
