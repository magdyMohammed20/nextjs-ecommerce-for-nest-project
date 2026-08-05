"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usersApi } from "../api/users-api";
import { isRootAdmin } from "../lib/root-admin";
import { useAuth } from "@/features/auth/context/auth-provider";
import { editUserSchema, type EditUserFormValues } from "../schemas/user-schema";
import type { User } from "../types/user-types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditUserFormProps {
  user: User;
}

export function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const { t } = useTranslation("userForm");
  const { user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRoot = isRootAdmin(user.email);
  const canChangeRole = isRootAdmin(currentUser?.email);
  const roleLocked = !canChangeRole || isRoot;
  const statusLocked = !canChangeRole || isRoot;

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    },
  });

  async function onSubmit(values: EditUserFormValues) {
    setIsSubmitting(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        role: roleLocked ? user.role : values.role,
        status: statusLocked ? "active" : values.status,
        ...(values.password ? { password: values.password } : {}),
      };
      await usersApi.update(user.id, payload);
      toast.success(t("toasts.userUpdated", { ns: "common" }));
      router.push("/users");
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
              <FormLabel>{t("name")}</FormLabel>
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
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newPassword")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("role")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={roleLocked ? user.role : field.value}
                  disabled={roleLocked}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectRole")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="user">{t(`roles.user`, { ns: "common" })}</SelectItem>
                    <SelectItem value="admin">{t(`roles.admin`, { ns: "common" })}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                {isRoot && <p className="text-xs text-muted-foreground">{t("rootAdminRoleLocked")}</p>}
                {!canChangeRole && <p className="text-xs text-muted-foreground">{t("roleChangeRestricted")}</p>}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={statusLocked ? "active" : field.value}
                  disabled={statusLocked}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">
                      {t(`statuses.active`, { ns: "common" })}
                    </SelectItem>
                    <SelectItem value="pending">
                      {t(`statuses.pending`, { ns: "common" })}
                    </SelectItem>
                    <SelectItem value="rejected">
                      {t(`statuses.rejected`, { ns: "common" })}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
                {isRoot && <p className="text-xs text-muted-foreground">{t("rootAdminStatusLocked")}</p>}
                {!canChangeRole && <p className="text-xs text-muted-foreground">{t("statusChangeRestricted")}</p>}
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("saveChanges")}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/users")}
          >
            {t("cancel")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
