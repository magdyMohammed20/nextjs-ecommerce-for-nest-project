"use client";

import { RequireRole } from "@/components/shared/require-role";
import { OrdersComingSoon } from "./orders-coming-soon";

export default function OrdersPage() {
  return (
    <RequireRole role="admin">
      <OrdersComingSoon />
    </RequireRole>
  );
}