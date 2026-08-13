"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Clock,
  DollarSign,
  HelpCircle,
  Package,
  PackageCheck,
  PackageX,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useStats } from "../hooks/use-stats";
import { activityApi } from "@/features/activity/api/activity-api";
import { ActivityFeed } from "@/features/activity/components/activity-feed";
import { ordersApi } from "@/features/orders/api/orders-api";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatDate } from "@/features/orders/lib/format";
import { useUsers } from "@/features/users/hooks/use-users";
import { useProducts } from "@/features/products/hooks/use-products";
import { useAuth } from "@/features/auth/context/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonStatsGrid } from "@/components/shared/skeletons";
import { StatCardBackdrop } from "@/components/shared/stat-card-backdrop";
import { QueryErrorState } from "@/components/shared/query-states";

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  extra,
}: {
  title: string;
  value: ReactNode;
  icon: typeof Users;
  description: string;
  extra?: ReactNode;
}) {
  return (
    <Card className="relative transition-shadow hover:shadow-md">
      <StatCardBackdrop />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4.5 w-4.5" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        {extra}
      </CardContent>
    </Card>
  );
}

function ActiveUsersIndicator({ label }: { label: string }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      {label}
    </div>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation("dashboard");

  const {
    data: stats,
    isPending: statsPending,
    isError: statsError,
  } = useStats(30_000);

  const {
    data: usersData,
    isPending: usersPending,
    isError: usersError,
  } = useUsers({ page: 1, limit: 5, search: "" });

  // Poll pending submissions so the review counter stays current.
  const {
    data: pendingData,
    isPending: pendingPending,
    isError: pendingError,
  } = useProducts({ status: "pending", limit: 1 }, 30_000);

  const {
    data: activity,
    isPending: activityPending,
    isError: activityError,
  } = useQuery({
    queryKey: ["activity", "latest"],
    queryFn: () => activityApi.getLatest(8),
  });

  const {
    data: latestOrders,
    isPending: ordersPending,
    isError: ordersError,
  } = useQuery({
    queryKey: ["orders", "latest"],
    queryFn: () => ordersApi.getLatest(),
  });

  const users = usersData?.data ?? [];
  const pendingSubmissions = pendingData?.meta.total ?? 0;
  const activityItems = activity ?? [];

  if (statsPending || usersPending || pendingPending || activityPending || ordersPending) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <SkeletonStatsGrid count={8} className="grid-cols-2 gap-4 md:grid-cols-4" />
        <div aria-hidden="true" className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (statsError || usersError || pendingError) {
    return (
      <div className="w-full py-16">
        <QueryErrorState title={t("toasts.failedToLoadDashboard", { ns: "common" })} />
      </div>
    );
  }

  const statsCards: {
    key: string;
    title: string;
    value: ReactNode;
    icon: typeof Users;
    extra?: ReactNode;
  }[] = [
    {
      key: "totalUsers",
      title: t("totalUsers"),
      value: stats?.usersTotal ?? 0,
      icon: Users,
      extra: (
        <ActiveUsersIndicator label={t("activeUsers", { count: stats?.onlineUsers ?? 0 })} />
      ),
    },
    { key: "totalProducts", title: t("totalProducts"), value: stats?.productsTotal ?? 0, icon: Package },
    { key: "categories", title: t("categories"), value: stats?.categoriesTotal ?? 0, icon: Tags },
    { key: "totalOrders", title: t("totalOrders"), value: stats?.totalOrders ?? 0, icon: ShoppingCart },
    { key: "pendingOrders", title: t("pendingOrders"), value: stats?.pendingOrders ?? 0, icon: Clock },
    {
      key: "pendingSubmissions",
      title: t("pendingSubmissions"),
      value: pendingSubmissions,
      icon: PackageCheck,
      extra: pendingSubmissions > 0 && (
        <Link
          href="/dashboard/products/submissions"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          {t("reviewNow")}
          <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
        </Link>
      ),
    },
    {
      key: "totalRevenue",
      title: t("totalRevenue"),
      value: stats ? formatMoney(stats.totalRevenue) : "$0.00",
      icon: DollarSign,
    },
    {
      key: "averageOrderValue",
      title: t("averageOrderValue"),
      value: stats ? formatMoney(stats.averageOrderValue) : "$0.00",
      icon: TrendingUp,
    },
    { key: "inStock", title: t("inStock"), value: stats?.inStock ?? 0, icon: PackageCheck },
    { key: "outOfStock", title: t("outOfStock"), value: stats?.outOfStock ?? 0, icon: PackageX },
    { key: "lowStock", title: t("lowStock"), value: stats?.lowStock ?? 0, icon: AlertTriangle },
    {
      key: "inventoryValue",
      title: t("inventoryValue"),
      value: stats ? formatMoney(stats.inventoryValue) : "$0.00",
      icon: DollarSign,
    },
    {
      key: "averagePrice",
      title: t("averagePrice"),
      value: stats ? formatMoney(stats.averagePrice) : "$0.00",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("welcome", { name: user?.name })}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statsCards.map((card) => (
          <StatCard
            key={card.key}
            title={card.title}
            value={card.value}
            icon={card.icon}
            description={t(`${card.key}Description`)}
            extra={card.extra}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>{t("recentUsers")}</CardTitle>
            <CardDescription>{t("recentUsersDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {users.slice(0, 5).map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                    {t(`roles.${u.role}`, { ns: "common" })}
                  </Badge>
                </li>
              ))}
              {users.length === 0 && (
                <li className="py-3 text-sm text-muted-foreground">{t("noUsersYet")}</li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
            <CardDescription>{t("quickActionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="grid flex-1 grid-cols-2 auto-rows-fr gap-2">
            {(() => {
              const quickLinkTexts = t("quickLinks", {
                returnObjects: true,
              }) as { title: string }[];
              const quickLinks = [
                { href: "/products/new", icon: Package, ...quickLinkTexts[0] },
                { href: "/users/new", icon: Users, ...quickLinkTexts[1] },
                { href: "/users", icon: ShieldCheck, ...quickLinkTexts[2] },
                { href: "/categories", icon: Tags, ...quickLinkTexts[3] },
                { href: "/dashboard/orders", icon: Receipt, ...quickLinkTexts[4] },
                { href: "/products", icon: Package, ...quickLinkTexts[5] },
                { href: "/dashboard/faq", icon: HelpCircle, ...quickLinkTexts[6] },
                {
                  href: "/dashboard/products/submissions",
                  icon: PackageCheck,
                  ...quickLinkTexts[7],
                },
              ];
              return quickLinks.map(({ href, icon: Icon, title }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex min-h-0 flex-col items-center justify-center gap-1.5 rounded-xl border bg-background p-2 text-center transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="line-clamp-2 text-xs leading-tight text-foreground transition-colors group-hover:text-primary">
                    {title}
                  </span>
                </Link>
              ));
            })()}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{t("latestOrders")}</CardTitle>
              <CardDescription>{t("latestOrdersDescription")}</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost" className="shrink-0">
              <Link href="/dashboard/orders">
                {t("viewAll")}
                <ArrowUpRight className="ms-1 h-3.5 w-3.5 rtl:-scale-x-100" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {ordersPending ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : ordersError ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                </span>
                <p className="text-sm font-medium text-muted-foreground">{t("failedToLoad")}</p>
              </div>
            ) : latestOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                </span>
                <p className="text-sm font-medium text-muted-foreground">{t("noOrdersYet")}</p>
              </div>
            ) : (
              <ul className="divide-y">
                {latestOrders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between gap-2 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">#{order.id} {order.customerEmail}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-medium">{formatMoney(order.total)}</span>
                      <OrderStatusBadge status={order.status} iconOnly />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
            <CardDescription>{t("recentActivityDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed
              items={activityItems}
              isLoading={activityPending}
              hasError={activityError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
