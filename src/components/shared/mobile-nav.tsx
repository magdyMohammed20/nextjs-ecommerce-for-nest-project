"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  Package,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/context/auth-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export function MobileNav() {
  const { isAdmin } = useAuth();
  const { t } = useTranslation("common");
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard, adminOnly: true },
    { href: "/products", label: t("nav.products"), icon: Package },
    { href: "/users", label: t("nav.users"), icon: Users, adminOnly: true },
    { href: "/profile", label: t("nav.profile"), icon: UserRound },
  ];

  const items = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("nav.openMenu")}>
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn("cursor-pointer", active && "font-medium text-primary")}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
