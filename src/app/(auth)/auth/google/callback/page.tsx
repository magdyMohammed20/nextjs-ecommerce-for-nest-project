"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{t("completing")}</p>
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
