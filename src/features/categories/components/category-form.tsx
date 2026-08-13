"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Ban, Check, Images, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateCategory, useUpdateCategory } from "../hooks/use-categories";
import {
  categorySchema,
  type CategoryFormValues,
} from "../schemas/category-schema";
import type { Category } from "../types/category-types";
import { CATEGORY_ICONS } from "../constants/category-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const { t } = useTranslation("categoriesAdmin");
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory(category?.id ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const slugTouched = useRef(Boolean(category));

  const form = useForm<CategoryFormValues>({
    mode: "onChange",
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          sortOrder: category.sortOrder,
          icon: category.icon ?? "",
        }
      : {
          name: "",
          slug: "",
          sortOrder: 0,
          icon: "",
        },
  });

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        sortOrder: values.sortOrder,
        icon: values.icon || undefined,
      };

      if (category) {
        await updateCategory.mutateAsync(payload);
        toast.success(t("toasts.categoryUpdated"));
      } else {
        await createCategory.mutateAsync(payload);
        toast.success(t("toasts.categoryCreated"));
      }
      router.push("/categories");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.somethingWentWrong", { ns: "common" }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("form.namePlaceholder")}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (!slugTouched.current) {
                      form.setValue("slug", slugify(e.target.value), { shouldValidate: true });
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.slug")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("form.slugPlaceholder")}
                  dir="ltr"
                  {...field}
                  onChange={(e) => {
                    slugTouched.current = true;
                    field.onChange(e.target.value);
                  }}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">{t("form.slugAuto")}</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sortOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.sortOrder")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder={t("form.sortOrderPlaceholder")}
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : Number(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => {
            const selected = CATEGORY_ICONS.find((icon) => icon.key === field.value);
            const SelectedIcon = selected?.Icon ?? Ban;
            return (
              <FormItem>
                <FormLabel>{t("form.icon")}</FormLabel>
                <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
                  <DialogTrigger asChild>
                    <Button type="button" variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <SelectedIcon className="h-4 w-4" />
                        {selected ? selected.key : t("form.noIcon")}
                      </span>
                      <Images className="h-4 w-4 opacity-60" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl sm:max-w-lg">
                    <DialogHeader>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Images className="h-4 w-4" />
                        </span>
                        <div>
                          <DialogTitle className="text-base">{t("form.icon")}</DialogTitle>
                          <DialogDescription className="text-xs">
                            {t("form.iconPlaceholder")}
                          </DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="grid grid-cols-8 gap-2">
                      <button
                        type="button"
                        aria-label={t("form.noIcon")}
                        onClick={() => field.onChange("")}
                        className={cn(
                          "relative flex aspect-square w-full items-center justify-center rounded-xl border transition-all hover:border-primary/50 hover:bg-muted/50",
                          !field.value
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border bg-background",
                        )}
                      >
                        <Ban className="h-5 w-5" />
                        {!field.value && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                            <Check className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </button>
                      {CATEGORY_ICONS.map(({ key, Icon }) => (
                        <button
                          key={key}
                          type="button"
                          aria-label={key}
                          onClick={() => field.onChange(key)}
                          className={cn(
                            "relative flex aspect-square w-full items-center justify-center rounded-xl border transition-all hover:border-primary/50 hover:bg-muted/50",
                            field.value === key
                              ? "border-primary bg-primary/10 shadow-sm"
                              : "border-border bg-background",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {field.value === key && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                              <Check className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>

                    <DialogFooter>
                      <Button type="button" onClick={() => setPickerOpen(false)}>
                        {t("done", { ns: "common" })}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <p className="text-xs text-muted-foreground">{t("form.iconPlaceholder")}</p>
              </FormItem>
            );
          }}
        />

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {category ? t("updateCategory") : t("createCategory")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/categories")}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
