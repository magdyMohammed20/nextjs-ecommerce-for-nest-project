"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CheckCheck,
  Eye,
  Mail,
  MailCheck,
  MailOpen,
  Send,
  Trash2,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { contactApi } from "../api/contact-api";
import { useUnreadCount } from "../hooks/use-unread-count";
import type { ContactMessage } from "../types/contact-types";
import { formatDateTime } from "@/features/orders/lib/format";
import type { PaginationMeta } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import { AnimatedResults } from "@/components/shared/animated-results";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SkeletonList } from "@/components/shared/skeletons";
import { Pagination } from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const LIMIT = 10;

type ReadFilter = "" | "true" | "false";

export function MessagesList() {
  const { t } = useTranslation("contact");
  const { t: tCommon } = useTranslation("common");
  const { setUnread } = useUnreadCount();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState<ReadFilter>("");
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [markAllBusy, setMarkAllBusy] = useState(false);
  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const [toDelete, setToDelete] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const loadMessages = useCallback(() => {
    let ignore = false;

    contactApi
      .getAll({
        page,
        limit: LIMIT,
        search,
        read: readFilter === "" ? undefined : readFilter === "true",
      })
      .then((res) => {
        if (ignore) return;
        if (res.data.length === 0 && page > 1) {
          setPage(Math.max(1, res.meta.totalPages));
          return;
        }
        setMessages(res.data);
        setMeta(res.meta);
      })
      .catch((error) => {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : t("inbox.failedToLoad"),
          );
        }
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, search, readFilter, t]);

  useEffect(() => loadMessages(), [loadMessages]);

  function handlePageChange(next: number) {
    setPage(next);
    setIsLoading(true);
  }

  function handleSearchChange(next: string) {
    if (next === search) return;
    setSearch(next);
    setPage(1);
    setIsLoading(true);
  }

  function handleReadFilter(next: string) {
    if (next === readFilter) return;
    setReadFilter(next as ReadFilter);
    setPage(1);
    setIsLoading(true);
  }

  function updateRow(id: number, updates: Partial<ContactMessage>) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    );
  }

  async function handleMarkRead(message: ContactMessage) {
    setBusyId(message.id);
    try {
      await contactApi.markRead(message.id);
      updateRow(message.id, { read: true, readAt: new Date().toISOString() });
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCommon("toasts.somethingWentWrong"),
      );
    } finally {
      setBusyId(null);
    }
  }

  async function handleMarkAllRead() {
    setMarkAllBusy(true);
    try {
      const res = await contactApi.markAllRead();
      setMessages((prev) =>
        prev.map((m) => ({ ...m, read: true, readAt: new Date().toISOString() })),
      );
      setUnread((prev) => Math.max(0, prev - res.updated));
      toast.success(t("inbox.markedAllRead"));
      if (readFilter === "false") loadMessages();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCommon("toasts.somethingWentWrong"),
      );
    } finally {
      setMarkAllBusy(false);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setIsDeleting(true);
    try {
      await contactApi.remove(toDelete.id);
      setMessages((prev) => prev.filter((m) => m.id !== toDelete.id));
      toast.success(t("inbox.deleted"));
      setToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCommon("toasts.somethingWentWrong"),
      );
    } finally {
      setIsDeleting(false);
    }
  }

  function openReply(message: ContactMessage) {
    setReplyingTo(message);
    setReplySubject(`Re: ${message.subject}`);
    setReplyBody("");
  }

  async function handleSendReply() {
    if (!replyingTo) return;
    if (!replyBody.trim()) return;
    setIsReplying(true);
    try {
      const res = await contactApi.reply(replyingTo.id, {
        subject: replySubject.trim(),
        body: replyBody.trim(),
      });
      updateRow(replyingTo.id, {
        repliedAt: new Date().toISOString(),
        replySubject: replySubject.trim(),
        replyBody: replyBody.trim(),
        read: true,
        readAt: new Date().toISOString(),
      });
      setUnread((prev) =>
        prev > 0 && !replyingTo.read ? prev - 1 : prev,
      );
      toast.success(
        res.mode === "preview"
          ? t("inbox.repliedPreview")
          : t("inbox.repliedSent"),
      );
      setReplyingTo(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : tCommon("toasts.somethingWentWrong"),
      );
    } finally {
      setIsReplying(false);
    }
  }

  const signature = `${search}|${readFilter}|${page}`;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onValueChange={setQuery}
            onSearch={handleSearchChange}
            placeholder={t("inbox.searchPlaceholder")}
            className="w-full sm:w-72"
          />
          <Select value={readFilter} onValueChange={handleReadFilter}>
            <SelectTrigger className="h-9 w-full sm:w-44">
              <SelectValue placeholder={t("inbox.filter.all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("inbox.filter.all")}</SelectItem>
              <SelectItem value="false">{t("inbox.filter.unread")}</SelectItem>
              <SelectItem value="true">{t("inbox.filter.read")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          disabled={markAllBusy}
          onClick={handleMarkAllRead}
        >
          {markAllBusy ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <CheckCheck className="h-3.5 w-3.5" />
          )}
          {t("inbox.markAllRead")}
        </Button>
      </div>

      <AnimatedResults signature={signature}>
        {isLoading ? (
          <SkeletonList count={LIMIT} />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-16 text-center">
            <MailOpen className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {search || readFilter ? t("inbox.emptyFiltered") : t("inbox.empty")}
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>{t("inbox.table.subject")}</TableHead>
                    <TableHead>{t("inbox.table.sender")}</TableHead>
                    <TableHead>{t("inbox.table.date")}</TableHead>
                    <TableHead>{t("inbox.table.status")}</TableHead>
                    <TableHead className="text-end">
                      {t("inbox.table.actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow
                      key={message.id}
                      className={cn(
                        "hover:bg-muted/40",
                        !message.read && "bg-primary/[0.03]",
                      )}
                    >
                      <TableCell>
                        <button
                          type="button"
                          className="group flex items-center gap-2 font-medium text-start"
                          onClick={() => setViewing(message)}
                        >
                          {!message.read && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                          )}
                          <span className="transition-colors group-hover:text-primary">
                            {message.subject}
                          </span>
                        </button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1.5 font-medium">
                            {message.name}
                            {message.userId != null && (
                              <Badge variant="secondary" className="gap-1">
                                <UserCheck className="h-3 w-3" />
                                {t("inbox.registered")}
                              </Badge>
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(message.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <Badge
                            variant={message.read ? "outline" : "default"}
                            className="w-fit gap-1"
                          >
                            {message.read ? (
                              <>
                                <CheckCheck className="h-3 w-3" />
                                {t("inbox.read")}
                              </>
                            ) : (
                              <>
                                <Mail className="h-3 w-3" />
                                {t("inbox.unread")}
                              </>
                            )}
                          </Badge>
                          {message.repliedAt != null && (
                            <Badge variant="secondary" className="w-fit gap-1">
                              <MailCheck className="h-3 w-3" />
                              {t("inbox.replied")}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-end">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("inbox.reply")}
                            onClick={() => openReply(message)}
                          >
                            <Send className="h-3.5 w-3.5" />
                            <span className="sr-only">{t("inbox.reply")}</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            title={t("inbox.view")}
                            onClick={() => setViewing(message)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span className="sr-only">{t("inbox.view")}</span>
                          </Button>
                          {!message.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              title={t("inbox.markRead")}
                              disabled={busyId === message.id}
                              onClick={() => handleMarkRead(message)}
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              <span className="sr-only">{t("inbox.markRead")}</span>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            title={t("inbox.delete")}
                            onClick={() => setToDelete(message)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">{t("inbox.delete")}</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Pagination
              page={meta?.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </AnimatedResults>

      <Dialog
        open={Boolean(viewing)}
        onOpenChange={(open) => !open && setViewing(null)}
      >
        {viewing && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{viewing.subject}</DialogTitle>
              <DialogDescription>
                {t("inbox.detail.from", {
                  name: viewing.name,
                  email: viewing.email,
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDateTime(viewing.createdAt)}</span>
                <div className="flex items-center gap-2">
                  {viewing.repliedAt != null && (
                    <Badge variant="secondary" className="gap-1">
                      <MailCheck className="h-3 w-3" />
                      {t("inbox.replied")}
                    </Badge>
                  )}
                  {viewing.userId != null && (
                    <Badge variant="secondary" className="gap-1">
                      <UserCheck className="h-3 w-3" />
                      {t("inbox.registered")}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-4 text-foreground">
                {viewing.message}
              </p>
              {viewing.repliedAt != null && (
                <div className="rounded-lg border border-emerald-300/40 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/40">
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <MailCheck className="h-3.5 w-3.5" />
                    {t("inbox.repliedAt", {
                      date: formatDateTime(viewing.repliedAt),
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {viewing.replySubject}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm">
                    {viewing.replyBody}
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setViewing(null);
                  openReply(viewing);
                }}
              >
                <Send className="h-3.5 w-3.5" />
                {t("inbox.reply")}
              </Button>
              {!viewing.read && (
                <Button size="sm" onClick={() => handleMarkRead(viewing)}>
                  <CheckCheck className="h-3.5 w-3.5" />
                  {t("inbox.markRead")}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <Dialog
        open={Boolean(replyingTo)}
        onOpenChange={(open) => {
          if (!open) setReplyingTo(null);
        }}
      >
        {replyingTo && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t("inbox.replyDialog.title")}</DialogTitle>
              <DialogDescription>
                {t("inbox.replyDialog.description", {
                  name: replyingTo.name,
                  email: replyingTo.email,
                })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="reply-subject">{t("inbox.replyDialog.subject")}</Label>
                <Input
                  id="reply-subject"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  maxLength={200}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply-body">{t("inbox.replyDialog.body")}</Label>
                <Textarea
                  id="reply-body"
                  rows={6}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  maxLength={5000}
                  placeholder={t("inbox.replyDialog.bodyPlaceholder")}
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {t("inbox.replyDialog.sendsTo")}
                  </p>
                  <p className="text-end text-xs text-muted-foreground">
                    {replyBody.length}/5000
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                variant="outline"
                disabled={isReplying}
                onClick={() => setReplyingTo(null)}
              >
                {tCommon("actions.cancel")}
              </Button>
              <Button
                size="sm"
                className="gap-1.5"
                disabled={isReplying || !replyBody.trim()}
                onClick={handleSendReply}
              >
                {isReplying ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                {t("inbox.replyDialog.send")}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      <AlertDialog
        open={Boolean(toDelete)}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("inbox.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("inbox.deleteDialog.description", { subject: toDelete?.subject })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {tCommon("actions.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting
                ? tCommon("actions.deleting")
                : tCommon("actions.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
