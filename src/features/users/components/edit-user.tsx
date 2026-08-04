"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Shield, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { usersApi } from "../api/users-api";
import { EditUserForm } from "./user-form";
import type { User } from "../types/user-types";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EditUser({ userId }: { userId: number }) {
  const { t } = useTranslation("userForm");
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    usersApi
      .getById(userId)
      .then((loaded) => {
        if (!ignore) setUser(loaded);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("toasts.failedToLoadUser", { ns: "common" }),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userId, t]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_280px]">
          <Skeleton className="h-80 w-full rounded-xl" />
          <Skeleton className="h-52 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        {t("userNotFound", { ns: "users" })}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("editTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("editSubtitle", { name: user.name })}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/users">
            <ArrowLeft className="me-2 h-4 w-4 rtl:-scale-x-100" />
            {t("backToUsers")}
          </Link>
        </Button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <EditUserForm user={user} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("account")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3 text-center">
              <UserAvatar
                name={user.name}
                avatarUrl={user.avatarUrl}
                className="h-16 w-16 text-lg"
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {t(`roles.${user.role}`, { ns: "common" })}
              </Badge>
              <Badge variant="outline">
                {t(`statuses.${user.status}`, { ns: "common" })}
              </Badge>
            </CardContent>
          </Card>

          <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{t("rolePermissions")}</p>
            <ul className="mt-2 space-y-1.5">
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
                {t("permAdmin")}
              </li>
              <li className="flex items-center gap-2">
                <UserRound className="h-3.5 w-3.5 shrink-0 text-primary" />
                {t("permUser")}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                {t("permEffect")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
