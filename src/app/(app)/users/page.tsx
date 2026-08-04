"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { RequireRole } from "@/components/shared/require-role";
import { UserList } from "@/features/users/components/user-list";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";

export default function UsersPage() {
  const { t } = useTranslation("users");

  return (
    <RequireRole role="admin">
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <Users className="h-6 w-6 text-primary" />
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button asChild>
            <Link href="/users/new">
              <UserPlus className="mr-2 h-4 w-4" />
              {t("addUser")}
            </Link>
          </Button>
        </div>
        <UserList />
      </div>
    </RequireRole>
  );
}
