"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { usersApi } from "@/features/users/api/users-api";
import { productsApi } from "@/features/products/api/products-api";
import type { User } from "@/features/users/types/user-types";
import type { Product } from "@/features/products/types/product-types";
import { useAuth } from "@/features/auth/context/auth-provider";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [totals, setTotals] = useState({ users: 0, products: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([usersApi.getAll({ limit: 5 }), productsApi.getAll({ limit: 5 })])
      .then(([userData, productData]) => {
        setUsers(userData.data);
        setProducts(productData.data);
        setTotals({
          users: userData.meta.total,
          products: productData.meta.total,
        });
      })
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : t("toasts.failedToLoadDashboard", { ns: "common" }),
        ),
      )
      .finally(() => setIsLoading(false));
  }, [t]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const outOfStock = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("welcome", { name: user?.name })}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title={t("totalUsers")}
          value={totals.users}
          icon={Users}
          description={t("totalUsersDescription")}
        />
        <StatCard
          title={t("totalProducts")}
          value={totals.products}
          icon={Package}
          description={t("totalProductsDescription")}
        />
        <StatCard
          title={t("outOfStock")}
          value={outOfStock}
          icon={ShieldCheck}
          description={t("outOfStockDescription")}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
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
      </div>
    </div>
  );
}
