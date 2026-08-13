"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateFaq, useUpdateFaq } from "../hooks/use-faqs";
import { faqSchema, type FaqFormValues } from "../schemas/faq-schema";
import type { Faq } from "../types/faq-types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface FaqFormProps {
  faq?: Faq;
}

export function FaqForm({ faq }: FaqFormProps) {
  const router = useRouter();
  const { t } = useTranslation("faqAdmin");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createFaq = useCreateFaq();
  const updateFaq = useUpdateFaq(faq?.id ?? 0);

  const form = useForm<FaqFormValues>({
    mode: "onTouched",
    resolver: zodResolver(faqSchema),
    defaultValues: faq
      ? {
          questionEn: faq.questionEn,
          questionAr: faq.questionAr,
          answerEn: faq.answerEn,
          answerAr: faq.answerAr,
          sortOrder: faq.sortOrder,
          isActive: faq.isActive,
        }
      : {
          questionEn: "",
          questionAr: "",
          answerEn: "",
          answerAr: "",
          sortOrder: 0,
          isActive: true,
        },
  });

  async function onSubmit(values: FaqFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        questionEn: values.questionEn,
        questionAr: values.questionAr,
        answerEn: values.answerEn,
        answerAr: values.answerAr,
        sortOrder: values.sortOrder,
        isActive: values.isActive,
      };

      if (faq) {
        await updateFaq.mutateAsync(payload);
        toast.success(t("toasts.faqUpdated"));
      } else {
        await createFaq.mutateAsync(payload);
        toast.success(t("toasts.faqCreated"));
      }
      router.push("/dashboard/faq");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.somethingWentWrong", { ns: "common" }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="questionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.questionEn")}</FormLabel>
                  <FormControl>
                    <Input
                      dir="ltr"
                      placeholder={t("form.questionEnPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.answerEn")}</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="ltr"
                      placeholder={t("form.answerEnPlaceholder")}
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-5">
            <FormField
              control={form.control}
              name="questionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.questionAr")}</FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      placeholder={t("form.questionArPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.answerAr")}</FormLabel>
                  <FormControl>
                    <Textarea
                      dir="rtl"
                      placeholder={t("form.answerArPlaceholder")}
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.sortOrder")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder={t("form.sortOrderPlaceholder")}
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                    }
                  />
                </FormControl>
                <FormDescription>{t("form.sortOrderHint")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("form.isActive")}</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3 pt-1">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-label={t("form.isActive")}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.value ? t("form.active") : t("form.inactive")}
                    </span>
                  </div>
                </FormControl>
                <FormDescription>{t("form.isActiveHint")}</FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {faq ? t("updateFaq") : t("createFaq")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/faq")}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
