"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { categoriesApi } from "../api/categories-api";
import {
  categorySchema,
  type CategoryFormValues,
} from "../schemas/category-schema";
import type { Category } from "../types/category-types";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slugTouched = useRef(Boolean(category));

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name,
          slug: category.slug,
          sortOrder: category.sortOrder,
        }
      : {
          name: "",
          slug: "",
          sortOrder: 0,
        },
  });

  async function onSubmit(values: CategoryFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        slug: values.slug,
        sortOrder: values.sortOrder,
      };

      if (category) {
        await categoriesApi.update(category.id, payload);
        toast.success(t("toasts.categoryUpdated"));
      } else {
        await categoriesApi.create(payload);
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
                      form.setValue("slug", slugify(e.target.value));
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
