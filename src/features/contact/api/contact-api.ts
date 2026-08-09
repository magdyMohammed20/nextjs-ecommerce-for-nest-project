import {
  contactControllerCreate,
  contactControllerFindAll,
  contactControllerFindLatest,
  contactControllerMarkAllRead,
  contactControllerMarkRead,
  contactControllerRemove,
  contactControllerReply,
  contactControllerUnreadCount,
} from "@/lib/generated/api";
import type { ContactMessageFilters } from "../types/contact-types";

export const contactApi = {
  submit: (data: { name: string; email: string; subject: string; message: string }) =>
    contactControllerCreate(data),
  getAll: ({
    page = 1,
    limit = 10,
    read,
    search,
  }: ContactMessageFilters = {}) =>
    contactControllerFindAll({ page, limit, read, search }),
  getLatest: (limit = 5) => contactControllerFindLatest({ limit }),
  unreadCount: () => contactControllerUnreadCount(),
  markRead: (id: number) => contactControllerMarkRead(id),
  markAllRead: () => contactControllerMarkAllRead(),
  remove: (id: number) => contactControllerRemove(id),
  reply: (id: number, data: { subject?: string; body: string }) =>
    contactControllerReply(id, data),
};
