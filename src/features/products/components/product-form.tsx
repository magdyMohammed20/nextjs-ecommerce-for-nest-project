"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { productsApi } from "../api/products-api";
import { categoriesApi } from "@/features/categories/api/categories-api";
import {
  productSchema,
  type ProductFormValues,
} from "../schemas/product-schema";
import type { Product } from "../types/product-types";
import type { Category } from "@/features/categories/types/category-types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImageInput } from "./product-image-input";

interface ProductFormProps {
  product?: Product;
  /**
   * "create" — admin publishes a new product (default).
   * "submit" — any user submits a product for admin approval (status=pending).
   * "edit"   — implied when `product` is passed; admin updates an existing product.
   */
  mode?: "create" | "edit" | "submit";
}

export function ProductForm({ product, mode = "create" }: ProductFormProps) {
  const router = useRouter();
  const { t } = useTranslation("productForm");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    categoriesApi
      .getAll()
      .then((data) => {
        if (!ignore) setCategories(data);
      })
      .catch(() => {
        // Category selector is optional; fall back to an empty list.
      })
      .finally(() => {
        if (!ignore) setCategoriesLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const form = useForm<ProductFormValues>({
    mode: "onTouched",
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          price: Number(product.price),
          description: product.description ?? "",
          quantity: product.quantity,
          categoryId: product.categoryId ?? undefined,
          imageUrl: product.imageUrl ?? "",
        }
      : {
          name: "",
          price: 0,
          description: "",
          quantity: 0,
          categoryId: undefined,
          imageUrl: "",
        },
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        price: values.price,
        description: values.description || undefined,
        quantity: values.quantity,
        categoryId: values.categoryId,
        imageUrl: values.imageUrl || undefined,
      };

      if (mode === "submit") {
         await productsApi.submit(payload);
        toast.success(t("toasts.submittedForApproval", { ns: "common" }));
        router.push("/products/mine");
      } else if (product) {
        await productsApi.update(product.id, {
          ...payload,
          categoryId: values.categoryId ?? null,
        });
        toast.success(t("toasts.productUpdated", { ns: "common" }));
        router.push("/products");
      } else {
        await productsApi.create(payload);
        toast.success(t("toasts.productCreated", { ns: "common" }));
        router.push("/products");
      }
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
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("namePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("price")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="500"
                        placeholder="499.99"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("quantity")}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="10"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? undefined : Number(e.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category")}</FormLabel>
                  {categoriesLoading ? (
                    <div role="status" aria-label={t("aria.loading", { ns: "common" })}>
                      <span className="sr-only">{t("aria.loading", { ns: "common" })}</span>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ) : (
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? undefined : Number(value))
                    }
                    value={field.value ? String(field.value) : "none"}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t("categoryPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">{t("noCategory")}</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("descriptionPlaceholder")}
                      className="min-h-28 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {mode === "submit" && (
                <div className="text-xs text-muted-foreground">
                  {t("pendingBanner")}
                </div>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "submit"
                  ? t("submitProduct")
                  : product
                    ? t("updateProduct")
                    : t("createProduct")}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/products")}
              >
                {t("cancel")}
              </Button>
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ProductImageInput value={field.value ?? ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-lg border bg-muted/40 p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{t("imageTips")}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4">
                <li>{t("imageTip1")}</li>
                <li>{t("imageTip2")}</li>
                <li>{t("imageTip3")}</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
