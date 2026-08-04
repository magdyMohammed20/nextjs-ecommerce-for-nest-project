"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoginForm } from "@/features/auth/components/login-form";

function PendingBanner() {
  const params = useSearchParams();
  const { t } = useTranslation("login");

  if (params.get("pending") !== "1") return null;

  return (
    <div className="mb-6 flex gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{t("pendingBanner")}</p>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useTranslation("login");

  return (
    <div className="rounded-xl border bg-background p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>
      <Suspense fallback={null}>
        <PendingBanner />
      </Suspense>
      <LoginForm />

      <div className="mt-6 rounded-lg border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">{t("demoTitle")}</p>
        <p className="mt-1">
          {t("demoAdmin")}: <span className="font-mono">admin@example.com</span> /{" "}
          <span className="font-mono">Admin@123</span>
        </p>
        <p>
          {t("demoUser")}: <span className="font-mono">user@example.com</span> /{" "}
          <span className="font-mono">User@123</span>
        </p>
      </div>
    </div>
  );
}
