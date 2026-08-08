"use client";

import { CheckCircle, Scale } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { AdminSubmissionsList } from "@/features/products/components/admin-submissions-list";
import { SubmissionAuditFeed } from "@/features/products/components/submission-audit-feed";

export default function AdminSubmissionsPage() {
  const { t } = useTranslation("dashboard");

  return (
    <RequireRole role="admin">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("submissions.title")}
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("submissions.subtitle")}
        </p>
        <AdminSubmissionsList />
        <div className="rounded-lg border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold">
              {t("submissions.audit.title")}
            </h2>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            {t("submissions.audit.subtitle")}
          </p>
          <SubmissionAuditFeed />
        </div>
      </div>
    </RequireRole>
  );
}
