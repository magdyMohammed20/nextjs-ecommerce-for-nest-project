"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HelpCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { faqApi } from "../api/faq-api";
import type { Faq } from "../types/faq-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonList } from "@/components/shared/skeletons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function FaqManager() {
  const { t } = useTranslation("faqAdmin");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [faqToDelete, setFaqToDelete] = useState<Faq | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    let ignore = false;

    faqApi
      .getManage()
      .then((items) => {
        if (!ignore) setFaqs(items);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("toasts.failedToLoadFaqs"),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [t]);

  async function handleDelete() {
    if (!faqToDelete) return;
    setIsDeleting(true);
    try {
      await faqApi.remove(faqToDelete.id);
      setFaqs((prev) => prev.filter((f) => f.id !== faqToDelete.id));
      toast.success(t("toasts.faqDeleted"));
      setFaqToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.failedToDeleteFaq"),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleActive(faq: Faq) {
    setTogglingId(faq.id);
    try {
      const updated = await faqApi.update(faq.id, { isActive: !faq.isActive });
      setFaqs((prev) => prev.map((f) => (f.id === faq.id ? updated : f)));
      toast.success(
        updated.isActive ? t("toasts.faqPublished") : t("toasts.faqUnpublished"),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.failedToUpdateFaq"),
      );
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/dashboard/faq/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addFaq")}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <SkeletonList count={5} />
      ) : faqs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
          <div className="rounded-full bg-muted p-4">
            <HelpCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t("empty")}</p>
          <Button asChild size="sm" variant="outline">
            <Link href="/dashboard/faq/new">{t("createFirst")}</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("table.question")}</TableHead>
                <TableHead>{t("table.sortOrder")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="text-end">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.map((faq) => (
                <TableRow key={faq.id} className="hover:bg-muted/40">
                  <TableCell className="max-w-lg">
                    <span className="font-medium">{faq.questionEn}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{faq.sortOrder}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={faq.isActive ? "default" : "secondary"}>
                      {faq.isActive ? t("status.active") : t("status.inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex items-center justify-end gap-3">
                      <Switch
                        checked={faq.isActive}
                        disabled={togglingId === faq.id}
                        onCheckedChange={() => handleToggleActive(faq)}
                        aria-label={t("toggleStatus")}
                      />
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/faq/${faq.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setFaqToDelete(faq)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog
        open={Boolean(faqToDelete)}
        onOpenChange={(open) => !open && setFaqToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { question: faqToDelete?.questionEn })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("actions.cancel", { ns: "common" })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? t("actions.deleting", { ns: "common" })
                : t("actions.delete", { ns: "common" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
