"use client";

import { useRef, useState } from "react";
import { Camera, Check, Images, Loader2, Shuffle, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { authApi } from "../api/auth-api";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  AVATAR_STYLES,
  getAvatarUrls,
  getRandomAvatar,
} from "../lib/generated-avatars";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDescription, FormLabel } from "@/components/ui/form";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface AvatarInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
}

export function AvatarInput({ name, value, onChange }: AvatarInputProps) {
  const { t } = useTranslation("common");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeStyle, setActiveStyle] = useState(AVATAR_STYLES[0].id);

  const activeStyleObj =
    AVATAR_STYLES.find((style) => style.id === activeStyle) ?? AVATAR_STYLES[0];
  const gallery = getAvatarUrls(activeStyleObj);

  async function handleFileSelected(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error(t("toasts.invalidImageType"));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(t("toasts.imageTooLarge"));
      return;
    }

    setIsUploading(true);
    try {
      const { url } = await authApi.uploadAvatar(file);
      onChange(url);
      toast.success(t("toasts.avatarUploaded"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toasts.uploadFailed"));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-3">
      <FormLabel>{t("avatar.label")}</FormLabel>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative">
          <UserAvatar
            name={name}
            avatarUrl={value}
            className="h-24 w-24 text-2xl"
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
          <button
            type="button"
            aria-label={t("avatar.upload")}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading ? t("avatar.uploading") : t("avatar.upload")}
            </Button>
            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => onChange("")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t("avatar.remove")}
              </Button>
            )}
          </div>
          <FormDescription>{t("avatar.description")}</FormDescription>
        </div>
      </div>

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com/avatar.jpg"
      />
      <FormDescription>{t("avatar.pasteHint")}</FormDescription>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <Images className="mr-2 h-4 w-4" />
            {t("avatar.gallery")}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain rounded-2xl sm:max-w-md">
          <div
            aria-hidden
            className="pointer-events-none sticky top-0 z-10 h-0.5 -mx-4 -mt-4 bg-gradient-to-r from-primary/60 via-primary/20 to-transparent"
          />

          <DialogHeader className="pt-0.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Images className="h-4 w-4" />
              </span>
              <div>
                <DialogTitle className="text-base">{t("avatar.dialogTitle")}</DialogTitle>
                <DialogDescription className="text-xs">
                  {t("avatar.dialogDescription")}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex items-center gap-3 rounded-xl border bg-muted/30 px-3 py-2">
            <UserAvatar name={name} avatarUrl={value} className="h-11 w-11 text-lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {value ? t("avatar.currentSelection") : t("avatar.noPhoto")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {AVATAR_STYLES.map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => setActiveStyle(style.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-medium transition-all",
                  style.id === activeStyle
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {style.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {gallery.map((url) => (
              <button
                key={url}
                type="button"
                aria-label={t("avatar.selectGenerated")}
                onClick={() => onChange(url)}
                className={cn(
                  "relative flex aspect-square w-full items-center justify-center rounded-xl border transition-all hover:border-primary/50 hover:bg-muted/50",
                  value === url
                    ? "border-primary bg-primary/10 shadow-sm"
                    : "border-border bg-background",
                )}
              >
                <UserAvatar name={name} avatarUrl={url} className="h-8 w-8" />
                {value === url && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <Check className="h-2.5 w-2.5" />
                  </span>
                )}
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onChange(getRandomAvatar())}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              {t("avatar.surpriseMe")}
            </Button>
            <Button type="button" onClick={() => setPickerOpen(false)}>
              {t("avatar.done")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
