"use client";

import { useCallback, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  LayoutDashboard,
  MessagesSquare,
  Package,
  PackageCheck,
  Receipt,
  Tags,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/context/auth-provider";
import { useUnreadCount } from "@/features/contact/hooks/use-unread-count";

const COLLAPSED_KEY = "sidebar-collapsed";
const COLLAPSED_EVENT = "sidebar-collapsed-change";

function subscribeCollapsed(callback: () => void) {
  window.addEventListener(COLLAPSED_EVENT, callback);
  return () => window.removeEventListener(COLLAPSED_EVENT, callback);
}

function useCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribeCollapsed,
    () => window.localStorage.getItem(COLLAPSED_KEY) === "1",
    () => false,
  );
  const setCollapsed = useCallback((next: boolean) => {
    window.localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
    window.dispatchEvent(new Event(COLLAPSED_EVENT));
  }, []);
  return [collapsed, setCollapsed] as const;
}

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  userOnly?: boolean;
  /** Match only the exact path (e.g. parent routes like /dashboard). */
  exact?: boolean;
  /** Show a count pill next to the label. */
  badgeCount?: number;
}

function SidebarLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;
  const isRtl =
    typeof document !== "undefined" && document.documentElement.dir === "rtl";

  const link = (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
        collapsed
          ? "justify-center px-0"
          : active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
      )}
    >
      <span
        className={cn(
          "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity rtl:right-0 rtl:left-auto rtl:rounded-l-full",
          !collapsed && (active ? "opacity-100" : "opacity-0"),
          collapsed && "hidden",
        )}
      />
      {collapsed ? (
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors",
            active
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-foreground",
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      ) : (
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-colors",
            active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
          )}
        />
      )}
      {!collapsed && item.label}
      {!collapsed && item.badgeCount != null && item.badgeCount > 0 && (
        <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
          {item.badgeCount > 99 ? "99+" : item.badgeCount}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side={isRtl ? "left" : "right"}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export function Sidebar() {
  const { isAdmin } = useAuth();
  const { t } = useTranslation("common");
  const { unread } = useUnreadCount();
  const [collapsed, setCollapsed] = useCollapsed();

  function toggleCollapsed() {
    setCollapsed(!collapsed);
  }

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard, adminOnly: true, exact: true },
    { href: "/my-dashboard", label: t("nav.dashboard"), icon: LayoutDashboard, userOnly: true, exact: true },
    { href: "/my-dashboard/orders", label: t("nav.orders"), icon: Receipt, userOnly: true },
    { href: "/products/mine", label: t("nav.mySubmissions"), icon: PackageCheck, userOnly: true },
    { href: "/dashboard/products/submissions", label: t("nav.submissions"), icon: PackageCheck, adminOnly: true },
    { href: "/products", label: t("nav.products"), icon: Package, exact: true },
    { href: "/categories", label: t("nav.categories"), icon: Tags, adminOnly: true },
    { href: "/dashboard/faq", label: t("nav.faq"), icon: HelpCircle, adminOnly: true },
    { href: "/dashboard/messages", label: t("nav.messages"), icon: MessagesSquare, adminOnly: true, badgeCount: unread },
    { href: "/dashboard/orders", label: t("nav.orders"), icon: Receipt, adminOnly: true },
    { href: "/users", label: t("nav.users"), icon: Users, adminOnly: true },
    { href: "/profile", label: t("nav.profile"), icon: UserRound },
  ];

  return (
    <aside
      suppressHydrationWarning
      className={cn(
        "hidden shrink-0 flex-col border-r bg-muted/40 transition-[width] duration-300 md:flex h-screen sticky top-0 overflow-hidden",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div
        className={cn(
          "shrink-0 border-b",
          collapsed
            ? "flex flex-col items-center gap-2 px-0 py-3"
            : "flex h-14 items-center justify-between gap-2.5 px-4",
        )}
      >
        <Logo
          iconClassName="h-8 w-8"
          textClassName="text-base"
          showText={!collapsed}
        />
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-muted-foreground hover:text-foreground"
          onClick={toggleCollapsed}
          title={collapsed ? t("nav.expandSidebar") : t("nav.collapseSidebar")}
        >
          {collapsed ? (
            <ChevronsRight className="h-4 w-4 rtl:rotate-180" />
          ) : (
            <ChevronsLeft className="h-4 w-4 rtl:rotate-180" />
          )}
        </Button>
      </div>
      <nav className={cn("flex flex-1 flex-col gap-1 overflow-y-auto p-3", collapsed && "items-center px-2")}>
        {navItems
          .filter((item) => {
            if (item.adminOnly) return isAdmin;
            if (item.userOnly) return !isAdmin;
            return true;
          })
          .map((item) => (
            <SidebarLink key={item.href} item={item} collapsed={collapsed} />
          ))}
      </nav>
    </aside>
  );
}
