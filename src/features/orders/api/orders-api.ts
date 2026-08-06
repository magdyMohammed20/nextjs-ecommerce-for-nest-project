import { apiFetch } from "@/lib/api-client";
import type { Paginated, PaginationParams } from "@/lib/pagination";
import type {
  CreateMyOrderPayload,
  CreateOrderPayload,
  Order,
  OrderStatus,
  OrderSummary,
  UpdateOrderStatusPayload,
} from "../types/order-types";

export interface OrdersQuery extends PaginationParams {
  status?: OrderStatus;
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
  getMine: ({ page = 1, limit = 10 }: PaginationParams = {}) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    return apiFetch<Paginated<Order>>(`/orders/mine?${params.toString()}`, {
      method: "GET",
    });
  },
  getById: (id: number) => apiFetch<Order>(`/orders/${id}`, { method: "GET" }),
  create: (data: CreateOrderPayload) =>
    apiFetch<Order>("/orders", { method: "POST", body: JSON.stringify(data) }),
  createForUser: (data: CreateMyOrderPayload) =>
    apiFetch<Order>("/orders/mine", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStatus: (id: number, status: OrderStatus) =>
    apiFetch<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status } satisfies UpdateOrderStatusPayload),
    }),
};
