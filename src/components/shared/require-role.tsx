"use client";

import type { ReactNode } from "react";
import type { UserRole } from "@/features/auth/types/auth-types";
import { useAuth } from "@/features/auth/context/auth-provider";
import { AccessDenied } from "./access-denied";

interface RequireRoleProps {
  role: UserRole;
  children: ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user?.role !== role) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
