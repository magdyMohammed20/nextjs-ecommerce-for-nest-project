"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, Pencil, Shield, Trash2, User as UserIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { isRootAdmin } from "../lib/root-admin";
import { useRemoveUser, useUpdateUserStatus, useUsers } from "../hooks/use-users";
import type { User } from "../types/user-types";
import type { UserStatus } from "@/features/auth/types/auth-types";
import { useAuth } from "@/features/auth/context/auth-provider";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SkeletonList } from "@/components/shared/skeletons";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import { AnimatedResults } from "@/components/shared/animated-results";
import { QueryErrorState } from "@/components/shared/query-states";
import { PresenceDot } from "@/components/shared/presence-dot";
import { formatDateTime } from "@/features/orders/lib/format";
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

const LIMIT = 10;

const statusBadgeStyles: Record<UserStatus, string> = {
  active: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  pending: "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  rejected: "border-destructive/40 bg-destructive/10 text-destructive",
};

const statusIcons: Record<UserStatus, typeof Clock> = {
  active: Check,
  pending: Clock,
  rejected: X,
};

export function UserList() {
  const { user: currentUser } = useAuth();
  const { t } = useTranslation("users");

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isLoading, isError, refetch } = useUsers({ page, limit: LIMIT, search });
  const removeUser = useRemoveUser();
  const updateUserStatus = useUpdateUserStatus();

  const users = data?.data ?? [];
  const meta = data?.meta ?? {
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  };

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
  }

  function handleSearchChange(nextSearch: string) {
    if (nextSearch === search) return;
    setSearch(nextSearch);
    setPage(1);
  }

  async function handleDelete() {
    if (!userToDelete) return;
    if (isRootAdmin(userToDelete.email)) {
      toast.error(t("rootAdminDeleteLocked"));
      setUserToDelete(null);
      return;
    }
    setIsDeleting(true);
    try {
      const lastItemOnPage = users.length === 1 && meta.page > 1;
      await removeUser.mutateAsync(userToDelete.id);
      if (lastItemOnPage) {
        setPage(meta.page - 1);
      }
      toast.success(t("toasts.userDeleted", { ns: "common" }));
      setUserToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.failedToDeleteUser", { ns: "common" }),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleStatusChange(user: User, status: UserStatus) {
    if (!isRootAdmin(currentUser?.email)) {
      toast.error(t("statusChangeRestricted", { ns: "userForm" }));
      return;
    }
    try {
      await updateUserStatus.mutateAsync({ id: user.id, status });
      toast.success(
        status === "active"
          ? t("toasts.userApproved", { ns: "common", name: user.name })
          : t("toasts.userRejected", { ns: "common", name: user.name }),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("toasts.somethingWentWrong", { ns: "common" }),
      );
    }
  }

  return (
    <div className="space-y-6">
      <SearchInput
        value={query}
        onValueChange={setQuery}
        onSearch={handleSearchChange}
        placeholder={t("searchPlaceholder")}
        className="w-full sm:w-80"
      />

      <AnimatedResults signature={`${search}|${page}`}>
        {isLoading ? (
          <SkeletonList count={6} />
        ) : isError ? (
          <QueryErrorState
            title={t("errors.failedToLoad", { ns: "common", defaultValue: "Failed to load users" })}
            onRetry={refetch}
          />
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
            <div className="rounded-full bg-muted p-4">
              <UserIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          </div>
        ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>{t("table.user")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.role")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.online")}</TableHead>
                <TableHead>{t("table.lastActive")}</TableHead>
                <TableHead className="text-end">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSelf = currentUser?.id === user.id;
                const isRoot = isRootAdmin(user.email);
                return (
                  <TableRow key={user.id} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={user.name}
                          avatarUrl={user.avatarUrl}
                          className="h-8 w-8 text-xs"
                        />
                        <span className="font-medium">
                          {user.name}
                          {isSelf && (
                            <span className="ml-2 text-xs text-muted-foreground">{t("youMarker")}</span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" && (
                          <Shield className="mr-1 h-3 w-3" />
                        )}
                        {t(`roles.${user.role}`, { ns: "common" })}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusBadgeStyles[user.status]}>
                        {(() => {
                          const StatusIcon = statusIcons[user.status];
                          return <StatusIcon className="mr-1 h-3 w-3" />;
                        })()}
                        {t(`statuses.${user.status}`, { ns: "common" })}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <PresenceDot isOnline={user.isOnline} lastActiveAt={user.lastActiveAt} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastActiveAt
                        ? formatDateTime(user.lastActiveAt)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-2">
                        {user.status === "pending" && isRootAdmin(currentUser?.email) && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-emerald-600 hover:text-emerald-600"
                              title={t("approve")}
                              onClick={() => handleStatusChange(user, "active")}
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span className="sr-only">{t("approve")}</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              title={t("reject")}
                              onClick={() => handleStatusChange(user, "rejected")}
                            >
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only">{t("reject")}</span>
                            </Button>
                          </>
                        )}
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/users/${user.id}/edit`}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive hover:text-destructive"
                          disabled={isSelf || isRoot}
                          title={isRoot ? t("rootAdminDeleteLocked") : undefined}
                          onClick={() => setUserToDelete(user)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

        <Pagination
          page={meta?.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={handlePageChange}
        />
      </AnimatedResults>

      <AlertDialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && setUserToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description", { name: userToDelete?.name })}
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
              {isDeleting ? t("actions.deleting", { ns: "common" }) : t("actions.delete", { ns: "common" })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
