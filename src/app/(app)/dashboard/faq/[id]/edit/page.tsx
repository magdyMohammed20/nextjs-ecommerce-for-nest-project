import { RequireRole } from "@/components/shared/require-role";
import { EditFaq } from "@/features/faq/components/edit-faq";

interface EditFaqPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditFaqPage({ params }: EditFaqPageProps) {
  const { id } = await params;
  return (
    <RequireRole role="admin">
      <EditFaq faqId={Number(id)} />
    </RequireRole>
  );
}