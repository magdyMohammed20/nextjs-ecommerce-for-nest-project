"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { productsApi } from "../api/products-api";
import { getProductImageUrl } from "../lib/product-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface ProductImageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductImageInput({ value, onChange }: ProductImageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation("productForm");
  const [isUploading, setIsUploading] = useState(false);

  const previewUrl = getProductImageUrl(value);

  async function handleFileSelected(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error(t("toasts.invalidImageType", { ns: "common" }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("toasts.imageTooLarge", { ns: "common" }));
      return;
    }

    setIsUploading(true);
    try {
      const { url } = await productsApi.uploadImage(file);
      onChange(url);
      toast.success(t("toasts.imageUploaded", { ns: "common" }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.uploadFailed", { ns: "common" }),
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <FormLabel>{t("productImage")}</FormLabel>

      <div className="flex gap-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("imagePlaceholder")}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFileSelected(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {isUploading ? t("uploading") : t("upload")}
        </Button>
      </div>

      {previewUrl ? (
        <div className="relative h-44 w-full overflow-hidden rounded-lg border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={t("imagePreviewAlt")}
            className="h-full w-full object-cover"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="absolute right-2 top-2"
            onClick={() => onChange("")}
            aria-label={t("removeImage")}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex h-44 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground">
          <ImagePlus className="h-6 w-6" />
          <span>{t("imageDropHint")}</span>
        </div>
      )}
    </div>
  );
}
