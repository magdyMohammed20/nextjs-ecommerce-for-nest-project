"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  HelpCircle,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/features/auth/context/auth-provider";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  userOnly?: boolean;
  /** Match only the exact path (e.g. parent routes like /dashboard). */
  exact?: boolean;
}

function SidebarLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
          active ? "opacity-100" : "opacity-0",
        )}
      />
      <Icon
        className={cn(
          "h-4 w-4 transition-colors",
          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {item.label}
    </Link>
  );
}

export function Sidebar() {
  const { isAdmin } = useAuth();
  const { t } = useTranslation("common");

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard, adminOnly: true, exact: true },
    { href: "/my-dashboard", label: t("nav.dashboard"), icon: LayoutDashboard, userOnly: true, exact: true },
    { href: "/products", label: t("nav.products"), icon: Package },
    { href: "/categories", label: t("nav.categories"), icon: Tags, adminOnly: true },
    { href: "/dashboard/faq", label: t("nav.faq"), icon: HelpCircle, adminOnly: true },
    { href: "/dashboard/carts", label: t("nav.carts"), icon: ShoppingCart, adminOnly: true },
    { href: "/users", label: t("nav.users"), icon: Users, adminOnly: true },
    { href: "/profile", label: t("nav.profile"), icon: UserRound },
  ];

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/40 md:block">
      <div className="flex h-14 items-center gap-2.5 border-b px-6">
        <Logo iconClassName="h-8 w-8" textClassName="text-base" />
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {navItems
          .filter((item) => {
            if (item.adminOnly) return isAdmin;
            if (item.userOnly) return !isAdmin;
            return true;
          })
          .map((item) => (
            <SidebarLink key={item.href} item={item} />
          ))}
      </nav>
    </aside>
  );
}
