"use client";

import { LogOut, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/features/auth/context/auth-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation("common");

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <UserAvatar name={user.name} avatarUrl={user.avatarUrl} className="h-9 w-9" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-0.5">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserRound className="mr-2 h-4 w-4" />
            {t("nav.profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("actions.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function RoleBadge() {
  const { user } = useAuth();
  const { t } = useTranslation("common");
  if (!user) return null;
  return (
    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
      {t(`roles.${user.role}`)}
    </Badge>
  );
}
