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
import { createUserSchema, type CreateUserFormValues } from "../schemas/user-schema";
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

export function AddUserForm() {
  const router = useRouter();
  const { t } = useTranslation("userForm");
  const { user: currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canChangeRole = isRootAdmin(currentUser?.email);

  const form = useForm<CreateUserFormValues>({
    mode: "onTouched",
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
  });

  async function onSubmit(values: CreateUserFormValues) {
    setIsSubmitting(true);
    try {
      await usersApi.create({ ...values, role: canChangeRole ? values.role : "user" });
      toast.success(t("toasts.userCreated", { ns: "common", name: values.name }));
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
                <Input placeholder="John Doe" autoComplete="off" {...field} />
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
                <Input
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="off"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("password")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("role")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={canChangeRole ? field.value : "user"}
                  disabled={!canChangeRole}
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
                {!canChangeRole && (
                  <p className="text-xs text-muted-foreground">{t("roleChangeRestricted")}</p>
                )}
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("createUser")}
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
