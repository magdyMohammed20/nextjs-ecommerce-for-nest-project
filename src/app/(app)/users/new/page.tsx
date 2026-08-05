"use client";

import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { AddUserForm } from "@/features/users/components/add-user-form";
import { ShieldCheck, UserPlus, UsersRound } from "lucide-react";

export default function NewUserPage() {
  const { t } = useTranslation("userForm");

  return (
    <RequireRole role="admin">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <UserPlus className="h-6 w-6 text-primary" />
            {t("newTitle")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("newSubtitle")}</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-xl border bg-background p-6 shadow-sm">
            <AddUserForm />
          </div>

          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t("rolesExplained")}</p>
                  <p className="text-xs text-muted-foreground">{t("rolesExplainedSubtitle")}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <UserPlus className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">{t(`roles.user`, { ns: "common" })}</span> —{" "}
                    {t("roleUserText")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium">{t(`roles.admin`, { ns: "common" })}</span> —{" "}
                    {t("roleAdminText")}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{t("roleSignIn")}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
