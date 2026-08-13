"use client";

import { HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FaqForm } from "./faq-form";
import { useManageFaqs } from "../hooks/use-faqs";
import { Skeleton } from "@/components/ui/skeleton";
import { QueryErrorState } from "@/components/shared/query-states";

export function EditFaq({ faqId }: { faqId: number }) {
  const { t } = useTranslation("faqAdmin");
  const { data: faqs = [], isLoading, isError, refetch } = useManageFaqs();
  const faq = faqs.find((f) => f.id === faqId) ?? null;

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
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

  if (isError) {
    return (
      <div className="w-full py-10">
        <QueryErrorState
          title={t("toasts.failedToLoadFaqs")}
          onRetry={refetch}
        />
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
    <div className="w-full space-y-6">
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