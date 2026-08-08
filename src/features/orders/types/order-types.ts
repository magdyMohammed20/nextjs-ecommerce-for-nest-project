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

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  userId: number | null;
  customerLastActiveAt?: string | null;
  customerIsOnline?: boolean;
  total: number;
  status: OrderStatus;
  phone: string | null;
  shippingAddress: ShippingAddress | null;
  notes: string | null;
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

export interface CreateMyOrderPayload {
  items: { productId: number; quantity: number }[];
  phone: string;
  shippingAddress: ShippingAddress;
  notes?: string;
}

/** Compact shape returned by GET /orders/mine/stats. */
export interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  activeOrders: number;
  completedOrders: number;
}

/** Shape returned by GET /orders/stats (admin). */
export interface OrderAdminStats {
  totalOrders: number;
  totalRevenue: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
