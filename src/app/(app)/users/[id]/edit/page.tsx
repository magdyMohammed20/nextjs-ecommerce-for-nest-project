import { RequireRole } from "@/components/shared/require-role";
import { EditUser } from "@/features/users/components/edit-user";

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  return (
    <RequireRole role="admin">
      <EditUser userId={Number(id)} />
    </RequireRole>
  );
}
