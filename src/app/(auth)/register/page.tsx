"use client";

import { useTranslation } from "react-i18next";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  const { t } = useTranslation("register");

  return (
    <div className="rounded-xl border bg-background p-8 shadow-sm">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">{t("subtitle")}</p>
      <RegisterForm />
    </div>
  );
}
