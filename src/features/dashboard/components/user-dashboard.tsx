"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  DollarSign,
  Heart,
  Package,
  ShoppingCart,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/context/auth-provider";
import { ordersApi } from "@/features/orders/api/orders-api";
import type { OrderSummary } from "@/features/orders/types/order-types";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatDate } from "@/features/orders/lib/format";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCardBackdrop } from "@/components/shared/stat-card-backdrop";

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function StatCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
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
        <div className="text-3xl font-bold tracking-tight">&mdash;</div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ComingSoonCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  const { t } = useTranslation("userDashboard");
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </span>
          <p className="text-sm font-medium text-muted-foreground">{t("comingSoon")}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentOrdersCard() {
  const { t } = useTranslation("userDashboard");
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let ignore = false;

    ordersApi
      .getMine({ page: 1, limit: 5 })
      .then((data) => {
        if (!ignore) setOrders(data.data);
      })
      .catch((error) => {
        if (!ignore) {
          setHasError(true);
          toast.error(
            error instanceof Error
              ? error.message
              : t("failedToLoad", { ns: "userDashboard" }),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [t]);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>{t("recentOrders")}</CardTitle>
          <CardDescription>{t("recentOrdersDescription")}</CardDescription>
        </div>
        <Button asChild size="sm" variant="ghost" className="shrink-0">
          <Link href="/my-dashboard/orders">
            {t("viewOrders")}
            <ArrowUpRight className="ms-1 h-3.5 w-3.5 rtl:-scale-x-100" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : hasError ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </span>
            <p className="text-sm font-medium text-muted-foreground">{t("failedToLoad")}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <ShoppingCart className="h-5 w-5 text-muted-foreground" />
            </span>
            <p className="text-sm font-medium text-muted-foreground">{t("noOrdersYet")}</p>
          </div>
        ) : (
          <ul className="divide-y">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between gap-2 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">#{order.id}</p>
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
  );
}

export function UserDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation("userDashboard");

  const stats: { key: string; icon: LucideIcon }[] = [
    { key: "orders", icon: ShoppingCart },
    { key: "spent", icon: DollarSign },
    { key: "wishlist", icon: Heart },
    { key: "reviews", icon: Star },
  ];

  const quickLinkTexts = t("quickLinks", {
    returnObjects: true,
  }) as { title: string; description: string }[];
  const quickLinks = [
    { href: "/products", icon: Package, ...quickLinkTexts[0] },
    { href: "/profile", icon: UserRound, ...quickLinkTexts[1] },
    { href: "/products", icon: ShoppingCart, ...quickLinkTexts[2] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("welcome", { name: user?.name })}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ key, icon }) => (
          <StatCard
            key={key}
            title={t(`stats.${key}`)}
            description={t(`stats.${key}Description`)}
            icon={icon}
          />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <RecentOrdersCard />
        <ComingSoonCard
          title={t("wishlistCard")}
          description={t("wishlistCardDescription")}
          icon={Heart}
        />
        <ComingSoonCard
          title={t("recentlyViewed")}
          description={t("recentlyViewedDescription")}
          icon={Clock}
        />

        <Card>
          <CardHeader>
            <CardTitle>{t("quickActions")}</CardTitle>
            <CardDescription>{t("quickActionsDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickLinks.map(({ href, icon: Icon, title, description }) => (
              <Link
                key={href + title}
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
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
