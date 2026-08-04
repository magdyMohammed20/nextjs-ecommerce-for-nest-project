import { RequireRole } from "@/components/shared/require-role";
import { EditProduct } from "@/features/products/components/edit-product";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  return (
    <RequireRole role="admin">
      <EditProduct productId={Number(id)} />
    </RequireRole>
  );
}
