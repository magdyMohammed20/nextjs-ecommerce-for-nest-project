"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { PageContainer } from "./page-container";
import { RoleBadge, UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isWide =
    pathname?.startsWith("/dashboard") || pathname?.startsWith("/my-dashboard");

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center justify-end gap-2 border-b bg-background px-4 md:px-6">
          <div className="mr-auto md:hidden">
            <MobileNav />
          </div>
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="hidden md:block">
            <RoleBadge />
          </div>
          <UserMenu />
        </header>
        <main className="flex-1">
          <PageContainer size={isWide ? "wide" : "default"}>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
