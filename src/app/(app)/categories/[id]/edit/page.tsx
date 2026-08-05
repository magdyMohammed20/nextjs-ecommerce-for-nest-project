import { RequireRole } from "@/components/shared/require-role";
import { EditCategory } from "@/features/categories/components/edit-category";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;
  return (
    <RequireRole role="admin">
      <EditCategory categoryId={Number(id)} />
    </RequireRole>
  );
}
