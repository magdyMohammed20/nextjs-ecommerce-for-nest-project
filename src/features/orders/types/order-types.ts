export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number | null;
  productName: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  userId: number | null;
  total: number;
  status: OrderStatus;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

/** Compact shape returned by GET /orders/latest for the dashboard card. */
export interface OrderSummary {
  id: number;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  customerEmail: string;
  items: { productId: number; quantity: number }[];
}

export interface CreateMyOrderPayload {
  items: { productId: number; quantity: number }[];
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
