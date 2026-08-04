"use client";

import type { ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/features/auth/context/auth-provider";
import { LanguageSync } from "@/components/language-sync";
import i18n from "@/lib/i18n";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <LanguageSync />
        <AuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
