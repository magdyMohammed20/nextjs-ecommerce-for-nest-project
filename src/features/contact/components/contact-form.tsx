"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ApiError } from "@/lib/api-client";
import { contactApi } from "../api/contact-api";
import { contactSchema, type ContactFormValues } from "../schemas/contact-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const { t } = useTranslation("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    mode: "onTouched",
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      honeypot: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    setIsSubmitting(true);
    try {
      await contactApi.submit(values);
      setSubmitted(true);
      form.reset();
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        toast.error(t("toasts.rateLimited"));
      } else {
        toast.error(
          error instanceof Error ? error.message : t("toasts.failed"),
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border bg-background p-10 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{t("success.title")}</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          {t("success.description")}
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          {t("success.sendAnother")}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-2xl border bg-background p-6"
      >
        {/* Honeypot — hidden from real users; bots fill it and get silently dropped. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          {...form.register("honeypot")}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.name")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("form.namePlaceholder")}
                    autoComplete="name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("form.email")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("form.emailPlaceholder")}
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.subject")}</FormLabel>
              <FormControl>
                <Input placeholder={t("form.subjectPlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.message")}</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder={t("form.messagePlaceholder")}
                  maxLength={2000}
                  {...field}
                />
              </FormControl>
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  {t("form.replyHint")}
                </p>
                <p className="text-end text-xs text-muted-foreground">
                  {field.value.length}/2000
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {t("form.submit")}
        </Button>
      </form>
    </Form>
  );
}
