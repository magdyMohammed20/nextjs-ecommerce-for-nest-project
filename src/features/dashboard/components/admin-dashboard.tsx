"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  HelpCircle,
  Package,
  PackageCheck,
  PackageX,
  ShieldCheck,
  ShoppingCart,
  Tags,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { statsApi } from "../api/stats-api";
import { usersApi } from "@/features/users/api/users-api";
import { ordersApi } from "@/features/orders/api/orders-api";
import type { OrderSummary } from "@/features/orders/types/order-types";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatDate } from "@/features/orders/lib/format";
import type { StatsDto } from "@/lib/generated/api";
import type { User } from "@/features/users/types/user-types";
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
}: {
  title: string;
  value: ReactNode;
  icon: typeof Users;
  description: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
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
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<StatsDto | null>(null);
  const [latestOrders, setLatestOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(false);

  useEffect(() => {
    Promise.all([statsApi.getStats(), usersApi.getAll({ limit: 5 })])
      .then(([statsData, userData]) => {
        setStats(statsData);
        setUsers(userData.data);
      })
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : t("toasts.failedToLoadDashboard", { ns: "common" }),
        ),
      )
      .finally(() => setIsLoading(false));
  }, [t]);

  useEffect(() => {
    let ignore = false;

    ordersApi
      .getLatest()
      .then((orders) => {
        if (!ignore) setLatestOrders(orders);
      })
      .catch((error) => {
        if (!ignore) {
          setOrdersError(true);
          toast.error(
            error instanceof Error
              ? error.message
              : t("toasts.failedToLoad", { ns: "orders" }),
          );
        }
      })
      .finally(() => {
        if (!ignore) setOrdersLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const statsCards: {
    key: string;
    title: string;
    value: ReactNode;
    icon: typeof Users;
  }[] = [
    { key: "totalUsers", title: t("totalUsers"), value: stats?.usersTotal ?? 0, icon: Users },
    { key: "totalProducts", title: t("totalProducts"), value: stats?.productsTotal ?? 0, icon: Package },
    { key: "categories", title: t("categories"), value: stats?.categoriesTotal ?? 0, icon: Tags },
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

        <Card>
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
            <CardDescription>{t("quickActionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-1">
            {(() => {
              const quickLinkTexts = t("quickLinks", {
                returnObjects: true,
              }) as { title: string; description: string }[];
              const quickLinks = [
                { href: "/products/new", icon: Package, ...quickLinkTexts[0] },
                { href: "/users/new", icon: Users, ...quickLinkTexts[1] },
                { href: "/users", icon: ShieldCheck, ...quickLinkTexts[2] },
                { href: "/products", icon: Package, ...quickLinkTexts[3] },
                { href: "/dashboard/faq", icon: HelpCircle, ...quickLinkTexts[4] },
              ];
              return quickLinks.map(({ href, icon: Icon, title, description }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-3 rounded-xl border bg-background p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 rtl:group-hover:-translate-y-0.5" />
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
            {ordersLoading ? (
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
                      <OrderStatusBadge status={order.status} />
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
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </span>
              <p className="text-sm font-medium text-muted-foreground">{t("comingSoon")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
