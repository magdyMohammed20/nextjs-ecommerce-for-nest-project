import { apiFetch } from "@/lib/api-client";
import type { Paginated, PaginationParams } from "@/lib/pagination";
import type {
  CreateMyOrderPayload,
  Order,
  OrderAdminStats,
  OrderStats,
  OrderStatus,
  OrderSummary,
  UpdateOrderStatusPayload,
} from "../types/order-types";

export interface OrdersQuery extends PaginationParams {
  status?: OrderStatus;
  sortBy?: "id" | "createdAt" | "total";
  sortOrder?: "ASC" | "DESC";
}

export const ordersApi = {
  getLatest: () => apiFetch<OrderSummary[]>("/orders/latest", { method: "GET" }),
  getAll: ({ page = 1, limit = 10, search = "", status }: OrdersQuery = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    return apiFetch<Paginated<Order>>(`/orders?${params.toString()}`, {
      method: "GET",
    });
  },
  getMine: ({
    page = 1,
    limit = 10,
    search = "",
    status,
    sortBy,
    sortOrder,
  }: OrdersQuery = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortOrder) params.set("sortOrder", sortOrder);
    return apiFetch<Paginated<Order>>(`/orders/mine?${params.toString()}`, {
      method: "GET",
    });
  },
  getMineStats: () =>
    apiFetch<OrderStats>("/orders/mine/stats", { method: "GET" }),
  getStats: () =>
    apiFetch<OrderAdminStats>("/orders/stats", { method: "GET" }),
  getById: (id: number) => apiFetch<Order>(`/orders/${id}`, { method: "GET" }),
  createForUser: (data: CreateMyOrderPayload) =>
    apiFetch<Order>("/orders/mine", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  cancelMine: (id: number) =>
    apiFetch<Order>(`/orders/mine/${id}/cancel`, { method: "POST" }),
  updateStatus: (id: number, status: OrderStatus) =>
    apiFetch<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status } satisfies UpdateOrderStatusPayload),
    }),
};
