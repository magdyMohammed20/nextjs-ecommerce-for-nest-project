"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/features/auth/context/auth-provider";
import i18n from "@/lib/i18n";
import type { AppLanguage } from "@/lib/i18n/server-language";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export function Providers({
  initialLang,
  children,
}: {
  initialLang: AppLanguage;
  children: ReactNode;
}) {
  if (i18n.language !== initialLang) {
    void i18n.changeLanguage(initialLang);
  }

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster richColors />
          </AuthProvider>
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
