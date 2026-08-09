"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteNavbar } from "@/components/shared/site-navbar";
import { SiteFooter } from "@/components/shared/site-footer";
import { PageHero } from "@/components/shared/page-hero";
import { ContactForm } from "@/features/contact/components/contact-form";

export default function ContactPage() {
  const { t } = useTranslation("contact");

  const channels = [
    { icon: Mail, title: t("page.channels.emailTitle"), body: t("page.channels.emailBody"), href: "mailto:support@shopwave.com", label: "support@shopwave.com" },
    { icon: Phone, title: t("page.channels.phoneTitle"), body: t("page.channels.phoneBody"), href: "tel:+15551234567", label: "+1 (555) 123-4567" },
    { icon: MapPin, title: t("page.channels.addressTitle"), body: t("page.channels.addressBody"), href: undefined, label: t("page.channels.addressLabel") },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        <PageHero>
          <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-cyan-200 backdrop-blur border border-white/20">
                  <MessageCircle className="h-7 w-7" />
                </div>
              </div>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
                {t("page.title")}
              </h1>
              <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-gradient-to-r from-cyan-300 to-sky-400" />
              <p className="mt-5 text-white/85">{t("page.subtitle")}</p>
            </motion.div>
          </div>
        </PageHero>

        {/* Channels */}
        <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {channels.map((channel) => (
              <div
                key={channel.title}
                className="flex flex-col items-center gap-3 rounded-3xl border bg-card p-8 text-center shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <channel.icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-bold">{channel.title}</h2>
                <p className="text-sm text-muted-foreground">{channel.body}</p>
                {channel.href ? (
                  <a
                    href={channel.href}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {channel.label}
                  </a>
                ) : (
                  <span className="text-sm font-medium">{channel.label}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Form */}
        <section className="mx-auto max-w-3xl scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border bg-card p-6 shadow-sm sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">{t("page.formTitle")}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("page.formDescription")}
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
