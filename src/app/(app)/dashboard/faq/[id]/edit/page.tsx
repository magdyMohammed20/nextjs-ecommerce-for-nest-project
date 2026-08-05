"use client";

import { useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { FaqForm } from "@/features/faq/components/faq-form";
import { faqApi } from "@/features/faq/api/faq-api";
import type { Faq } from "@/features/faq/types/faq-types";
import { Skeleton } from "@/components/ui/skeleton";

function EditFaq({ faqId }: { faqId: number }) {
  const { t } = useTranslation("faqAdmin");
  const [faq, setFaq] = useState<Faq | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    faqApi
      .getManage()
      .then((items) => {
        if (!ignore) setFaq(items.find((f) => f.id === faqId) ?? null);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("toasts.failedToLoadFaqs"),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [faqId, t]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="rounded-xl border p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!faq) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        {t("faqNotFound")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <HelpCircle className="h-6 w-6 text-primary" />
          {t("editTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("editSubtitle", { question: faq.questionEn })}
        </p>
      </div>
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <FaqForm faq={faq} />
      </div>
    </div>
  );
}

export default function EditFaqPage({ params }: { params: { id: string } }) {
  const faqId = Number(params.id);

  return (
    <RequireRole role="admin">
      <EditFaq faqId={faqId} />
    </RequireRole>
  );
}
