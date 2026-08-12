"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/context/auth-provider";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithToken } = useAuth();
  const { t } = useTranslation("google");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const token = searchParams.get("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    signInWithToken(token).catch(() => {
      router.replace("/login");
    });
  }, [router, searchParams, signInWithToken]);

  return (
    <div
      role="status"
      aria-label={t("aria.loading", { ns: "common" })}
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4"
    >
      <div
        aria-hidden="true"
        className="h-10 w-64 space-y-3"
      >
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      </div>
      <p className="sr-only">{t("completing")}</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
