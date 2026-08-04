import { apiFetch } from "@/lib/api-client";
import type { Paginated, PaginationParams } from "@/lib/pagination";
import type { UserStatus } from "@/features/auth/types/auth-types";
import {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from "../types/user-types";

export const usersApi = {
  getAll: ({ page = 1, limit = 10, search = "" }: PaginationParams = {}) =>
    apiFetch<Paginated<User>>(
      `/user?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      { method: "GET" },
    ),
  getById: (id: number) => apiFetch<User>(`/user/${id}`, { method: "GET" }),
  create: (data: CreateUserPayload) =>
    apiFetch<User>("/user", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: UpdateUserPayload) =>
    apiFetch<User>(`/user/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  updateStatus: (id: number, status: UserStatus) =>
    apiFetch<User>(`/user/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  remove: (id: number) =>
    apiFetch<{ message: string }>(`/user/${id}`, { method: "DELETE" }),
};
