"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { KeyRound, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { authApi } from "../api/auth-api";
import {
  updateProfileSchema,
  type UpdateProfileFormValues,
} from "../schemas/auth-schemas";
import type { AuthUser } from "../types/auth-types";
import { AvatarInput } from "./avatar-input";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface EditProfileFormProps {
  user: AuthUser;
  onProfileUpdated: (user: AuthUser) => void;
}

export function EditProfileForm({ user, onProfileUpdated }: EditProfileFormProps) {
  const router = useRouter();
  const { t } = useTranslation("profileEdit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UpdateProfileFormValues>({
    mode: "onTouched",
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: UpdateProfileFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        avatarUrl: values.avatarUrl,
        ...(values.password ? { password: values.password } : {}),
      };

      const updated = await authApi.updateMe(payload);
      onProfileUpdated(updated);
      toast.success(t("toasts.profileUpdated", { ns: "common" }));
      router.push("/profile");
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
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-3">
            <KeyRound className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{t("accountRole")}</span>
          </div>
          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
            {t(`roles.${user.role}`, { ns: "common" })}
          </Badge>
        </div>

        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <AvatarInput name={user.name} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fullName")}</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div>
          <h3 className="text-sm font-medium">{t("changePassword")}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{t("changePasswordHint")}</p>
        </div>

        <div className="grid gap-5 min-[520px]:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="whitespace-nowrap">{t("newPassword")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="min-w-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="whitespace-nowrap">{t("confirmPassword")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="min-w-0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="-mt-2 text-sm text-muted-foreground">{t("passwordHint")}</p>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveChanges")}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
            {t("cancel", { ns: "common" })}
          </Button>
        </div>
      </form>
    </Form>
  );
}
