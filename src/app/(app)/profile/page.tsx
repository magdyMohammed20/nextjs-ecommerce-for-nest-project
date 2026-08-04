"use client";

import { useAuth } from "@/features/auth/context/auth-provider";
import Link from "next/link";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useTranslation("profile");

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/profile/edit">
            <Pencil className="mr-2 h-4 w-4" />
            {t("editProfile")}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="h-16 w-16 text-lg" />
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="ml-auto">
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {t(`roles.${user.role}`, { ns: "common" })}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("userID")}</dt>
              <dd className="font-medium">{user.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("name")}</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("email")}</dt>
              <dd className="font-medium">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("role")}</dt>
              <dd className="font-medium capitalize">{t(`roles.${user.role}`, { ns: "common" })}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
