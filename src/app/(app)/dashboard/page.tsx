import { RequireRole } from "@/components/shared/require-role";
import { AdminDashboard } from "@/features/dashboard/components/admin-dashboard";

export default function DashboardPage() {
  return (
    <RequireRole role="admin">
      <AdminDashboard />
    </RequireRole>
  );
}
