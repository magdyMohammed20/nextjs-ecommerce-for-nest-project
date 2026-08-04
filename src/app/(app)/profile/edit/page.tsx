"use client";

import Link from "next/link";
import { ArrowLeft, KeyRound, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/context/auth-provider";
import { EditProfileForm } from "@/features/auth/components/edit-profile-form";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useTranslation("profileEdit");

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/profile">
            <ArrowLeft className="me-2 h-4 w-4 rtl:-scale-x-100" />
            {t("backToProfile")}
          </Link>
        </Button>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <EditProfileForm user={user} onProfileUpdated={updateUser} />
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{t("yourAccount")}</CardTitle>
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
            </CardContent>
          </Card>

          <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{t("goodToKnow")}</p>
            <ul className="mt-2 space-y-1.5">
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 text-primary" />
                {t("roleCannotChange")}
              </li>
              <li className="flex items-center gap-2">
                <KeyRound className="h-3.5 w-3.5 shrink-0 text-primary" />
                {t("passwordBlankHint")}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
