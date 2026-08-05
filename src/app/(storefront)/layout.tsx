"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/context/auth-provider";
import { AppShell } from "@/components/shared/app-shell";
import { StorefrontHeader } from "@/components/storefront/storefront-header";
import { StorefrontFooter } from "@/components/storefront/storefront-footer";
import { PageContainer } from "@/components/shared/page-container";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader />
      <main className="flex-1">
        <PageContainer>{children}</PageContainer>
      </main>
      <StorefrontFooter />
    </div>
  );
}
