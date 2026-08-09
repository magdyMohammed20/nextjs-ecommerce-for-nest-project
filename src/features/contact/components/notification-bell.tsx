"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Check, CheckCheck, Inbox, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { contactApi } from "../api/contact-api";
import { useUnreadCount } from "../hooks/use-unread-count";
import { useAuth } from "@/features/auth/context/auth-provider";
import type { ContactMessage } from "../types/contact-types";
import { formatDateTime } from "@/features/orders/lib/format";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LATEST_LIMIT = 6;

export function NotificationBell() {
  const { isAdmin } = useAuth();
  const { t } = useTranslation("contact");
  const { unread, setUnread } = useUnreadCount();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [markAllBusy, setMarkAllBusy] = useState(false);
  const prevUnread = useRef(unread);

  // Toast once when the unread count rises (new message while on the page).
  useEffect(() => {
    if (unread > prevUnread.current && prevUnread.current >= 0) {
      toast.info(t("toasts.newMessage"));
    }
    prevUnread.current = unread;
  }, [unread, t]);

  const loadLatest = useCallback(() => {
    contactApi
      .getLatest(LATEST_LIMIT)
      .then((messages) => {
        setItems(messages);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : t("toasts.failedToLoad"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [t]);

  useEffect(() => {
    if (open) loadLatest();
  }, [open, loadLatest]);

  async function handleMarkRead(message: ContactMessage) {
    setUpdatingId(message.id);
    try {
      await contactApi.markRead(message.id);
      setItems((prev) =>
        prev.map((m) =>
          m.id === message.id ? { ...m, read: true, readAt: new Date().toISOString() } : m,
        ),
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toasts.failed"));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleMarkAllRead() {
    setMarkAllBusy(true);
    try {
      const res = await contactApi.markAllRead();
      setItems((prev) =>
        prev.map((m) => ({ ...m, read: true, readAt: new Date().toISOString() })),
      );
      setUnread((prev) => Math.max(0, prev - res.updated));
      toast.success(t("toasts.allRead"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("toasts.failed"));
    } finally {
      setMarkAllBusy(false);
    }
  }

  if (!isAdmin) return null;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setIsLoading(true);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("bell.label")}
        >
          <Bell className="h-4.5 w-4.5" />
          <AnimatePresence>
            {unread > 0 && (
              <motion.span
                key={unread}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white"
                aria-live="polite"
              >
                {unread > 99 ? "99+" : unread}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="text-sm font-semibold">
            {t("bell.title")}
          </DropdownMenuLabel>
          {unread > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-7 gap-1.5 px-2 text-xs"
              disabled={markAllBusy}
              onClick={handleMarkAllRead}
            >
              {markAllBusy ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCheck className="h-3 w-3" />
              )}
              {t("bell.markAllRead")}
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            <Inbox className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("bell.empty")}</p>
          </div>
        ) : (
          items.map((message) => (
            <div
              key={message.id}
              className={message.read ? "opacity-60" : ""}
            >
              <DropdownMenuItem
                asChild
                className="cursor-default"
                onSelect={(e: Event) => e.preventDefault()}
              >
                <div className="flex flex-col gap-1 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium">
                      {!message.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                      <span className="truncate">{message.subject}</span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatDateTime(message.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {message.name} — {message.message}
                  </p>
                </div>
              </DropdownMenuItem>
              <div className="flex items-center justify-between px-2 pb-2">
                <span className="text-xs text-muted-foreground">
                  <MessageSquare className="mr-1 inline h-3 w-3" />
                  {message.read ? t("bell.read") : t("bell.unread")}
                </span>
                {!message.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 gap-1 px-2 text-xs"
                    disabled={updatingId === message.id}
                    onClick={() => handleMarkRead(message)}
                  >
                    {updatingId === message.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    {t("bell.markRead")}
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
            </div>
          ))
        )}

        <DropdownMenuItem asChild className="justify-center font-medium">
          <Link href="/dashboard/messages">{t("bell.viewAll")}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
