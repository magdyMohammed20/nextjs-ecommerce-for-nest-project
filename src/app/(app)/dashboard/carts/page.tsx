"use client";

import { AdminCarts } from "@/features/cart/components/admin-carts";
import { RequireRole } from "@/components/shared/require-role";

export default function AdminCartsPage() {
  return (
    <RequireRole role="admin">
      <div className="space-y-6">
        <AdminCarts />
      </div>
    </RequireRole>
  );
}