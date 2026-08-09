"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { PageContainer } from "./page-container";
import { Heartbeat } from "./heartbeat";
import { RoleBadge, UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { CartBadge } from "@/features/cart/components/cart-badge";
import { NotificationBell } from "@/features/contact/components/notification-bell";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Heartbeat />
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
          <NotificationBell />
          <CartBadge />
          <UserMenu />
        </header>
        <main className="flex-1">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
