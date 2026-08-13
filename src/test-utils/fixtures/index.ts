import type { Product, Category, ActivitySummaryDto, Faq, StatsDto } from "@/lib/generated/api";
import type { AuthUser } from "@/features/auth/types/auth-types";
import type { User } from "@/features/users/types/user-types";
import type {
  Order,
  OrderSummary,
  OrderStats,
  OrderAdminStats,
} from "@/features/orders/types/order-types";

export const adminUser: AuthUser = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  status: "active",
  avatarUrl: null,
};

export const maryUser: AuthUser = {
  id: 2,
  name: "Mary Johnson",
  email: "mary@example.com",
  role: "user",
  status: "active",
  avatarUrl: null,
};

export const categories: Category[] = [
  { id: 1, name: "Electronics", slug: "electronics" },
  { id: 2, name: "Clothing", slug: "clothing" },
  { id: 3, name: "Home & Living", slug: "home-living" },
  { id: 4, name: "Sports", slug: "sports" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    description: "Noise-cancelling over-ear headphones with 30h battery.",
    price: 129.99,
    quantity: 24,
    imageUrl: "https://picsum.photos/seed/headphones/640/400",
    status: "active",
    categoryId: 1,
    category: categories[0],
    createdAt: "2026-07-20T10:00:00Z",
    updatedAt: "2026-07-20T10:00:00Z",
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Fitness tracking smart watch with AMOLED display.",
    price: 199.0,
    quantity: 0,
    imageUrl: "https://picsum.photos/seed/watch/640/400",
    status: "active",
    categoryId: 1,
    category: categories[0],
    createdAt: "2026-07-19T09:00:00Z",
    updatedAt: "2026-07-19T09:00:00Z",
  },
  {
    id: 3,
    name: "Cotton T-Shirt",
    description: "100% organic cotton, regular fit, unisex.",
    price: 24.5,
    quantity: 120,
    imageUrl: "https://picsum.photos/seed/tshirt/640/400",
    status: "active",
    categoryId: 2,
    category: categories[1],
    createdAt: "2026-07-18T08:00:00Z",
    updatedAt: "2026-07-18T08:00:00Z",
  },
  {
    id: 4,
    name: "Ceramic Coffee Mug",
    description: "Hand-thrown stoneware mug, 350ml.",
    price: 18.0,
    quantity: 60,
    imageUrl: "https://picsum.photos/seed/mug/640/400",
    status: "active",
    categoryId: 3,
    category: categories[2],
    createdAt: "2026-07-17T07:00:00Z",
    updatedAt: "2026-07-17T07:00:00Z",
  },
  {
    id: 5,
    name: "Yoga Mat",
    description: "Non-slip eco-friendly yoga mat, 6mm.",
    price: 34.0,
    quantity: 45,
    imageUrl: "https://picsum.photos/seed/yoga/640/400",
    status: "active",
    categoryId: 4,
    category: categories[3],
    createdAt: "2026-07-16T06:00:00Z",
    updatedAt: "2026-07-16T06:00:00Z",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    description: "Waterproof portable speaker with deep bass.",
    price: 59.99,
    quantity: 8,
    imageUrl: "https://picsum.photos/seed/speaker/640/400",
    status: "pending",
    categoryId: 1,
    category: categories[0],
    createdAt: "2026-07-15T05:00:00Z",
    updatedAt: "2026-07-15T05:00:00Z",
  },
];

export const users: User[] = [
  { id: 1, name: "Admin User", email: "admin@example.com", role: "admin", status: "active", isOnline: true, lastActiveAt: "2026-08-12T08:30:00Z" },
  { id: 2, name: "Mary Johnson", email: "mary@example.com", role: "user", status: "active", isOnline: true, lastActiveAt: "2026-08-12T08:10:00Z" },
  { id: 3, name: "Ahmed Hassan", email: "ahmed@example.com", role: "user", status: "active", isOnline: false, lastActiveAt: "2026-08-11T18:00:00Z" },
  { id: 4, name: "Sara Ali", email: "sara@example.com", role: "user", status: "pending", isOnline: false, lastActiveAt: null },
  { id: 5, name: "John Smith", email: "john@example.com", role: "user", status: "rejected", isOnline: false, lastActiveAt: "2026-08-10T12:00:00Z" },
];

export const faqItems: Faq[] = [
  {
    id: 1,
    questionEn: "How fast is delivery?",
    questionAr: "كم يستغرق التوصيل؟",
    answerEn: "Orders ship within 24 hours and arrive in 2–5 business days.",
    answerAr: "تُشحن الطلبات خلال 24 ساعة وتصل خلال 2–5 أيام عمل.",
    isActive: true,
    sortOrder: 1,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
  {
    id: 2,
    questionEn: "Can I return a product?",
    questionAr: "هل يمكنني إرجاع منتج؟",
    answerEn: "Yes, returns are accepted within 30 days of delivery.",
    answerAr: "نعم، يُقبل الإرجاع خلال 30 يوماً من التوصيل.",
    isActive: true,
    sortOrder: 2,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
  {
    id: 3,
    questionEn: "Do you offer gift wrapping?",
    questionAr: "هل توفرون تغليف الهدايا؟",
    answerEn: "Gift wrapping is available at checkout for $2 per item.",
    answerAr: "تغليف الهدايا متاح عند الدفع مقابل 2 دولار للقطعة.",
    isActive: false,
    sortOrder: 3,
    createdAt: "2026-07-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
];

export const orders: Order[] = [
  {
    id: 101,
    customerName: "Mary Johnson",
    customerEmail: "mary@example.com",
    userId: 2,
    customerIsOnline: true,
    total: 154.49,
    status: "shipped",
    phone: "+15551234567",
    shippingAddress: { street: "12 Maple Drive", city: "Austin", state: "TX", postalCode: "73301", country: "US" },
    notes: null,
    items: [
      { id: 1, orderId: 101, productId: 1, productName: "Wireless Headphones", unitPrice: 129.99, quantity: 1 },
      { id: 2, orderId: 101, productId: 4, productName: "Ceramic Coffee Mug", unitPrice: 18.0, quantity: 1 },
    ],
    createdAt: "2026-08-10T09:15:00Z",
    updatedAt: "2026-08-11T14:00:00Z",
  },
  {
    id: 102,
    customerName: "Ahmed Hassan",
    customerEmail: "ahmed@example.com",
    userId: 3,
    customerIsOnline: false,
    total: 49.0,
    status: "pending",
    phone: "+201012345678",
    shippingAddress: { street: "15 Nile Street", city: "Cairo", state: "Cairo", postalCode: "11511", country: "EG" },
    notes: "Leave at the door.",
    items: [{ id: 3, orderId: 102, productId: 5, productName: "Yoga Mat", unitPrice: 34.0, quantity: 1 }],
    createdAt: "2026-08-11T11:30:00Z",
    updatedAt: "2026-08-11T11:30:00Z",
  },
  {
    id: 103,
    customerName: "Sara Ali",
    customerEmail: "sara@example.com",
    userId: 4,
    customerIsOnline: false,
    total: 397.99,
    status: "confirmed",
    phone: "+201098765432",
    shippingAddress: { street: "3 Garden Ave", city: "Dubai", state: "Dubai", postalCode: "00000", country: "AE" },
    notes: null,
    items: [
      { id: 4, orderId: 103, productId: 2, productName: "Smart Watch", unitPrice: 199.0, quantity: 2 },
    ],
    createdAt: "2026-08-09T16:45:00Z",
    updatedAt: "2026-08-10T08:20:00Z",
  },
];

export const orderSummaries: OrderSummary[] = orders.map((o) => ({
  id: o.id,
  customerEmail: o.customerEmail,
  total: o.total,
  status: o.status,
  createdAt: o.createdAt,
}));

export const orderStats: OrderStats = {
  totalOrders: 4,
  totalSpent: 645.47,
  activeOrders: 2,
  completedOrders: 1,
};

export const orderAdminStats: OrderAdminStats = {
  totalOrders: 3,
  totalRevenue: 601.48,
  pending: 1,
  confirmed: 1,
  shipped: 1,
  delivered: 0,
  cancelled: 0,
};

export const activityEntries: ActivitySummaryDto[] = [
  { id: 1, action: "order.created", actorName: "Mary Johnson", actorRole: "user", targetType: "order", targetId: 101, createdAt: "2026-08-11T14:00:00Z" },
  { id: 2, action: "contact.message", actorName: "Ahmed Hassan", actorRole: "user", targetType: "contact", targetId: 7, createdAt: "2026-08-11T11:30:00Z" },
  { id: 3, action: "product.updated", actorName: "Admin User", actorRole: "admin", targetType: "product", targetId: 1, createdAt: "2026-08-11T10:00:00Z" },
  { id: 4, action: "order.status_changed", actorName: "Admin User", actorRole: "admin", targetType: "order", targetId: 101, createdAt: "2026-08-11T09:45:00Z" },
  { id: 5, action: "user.created", actorName: "Admin User", actorRole: "admin", targetType: "user", targetId: 4, createdAt: "2026-08-10T16:00:00Z" },
];

export const contactMessages = [
  {
    id: 7,
    name: "Ahmed Hassan",
    email: "ahmed@example.com",
    subject: "Question about delivery",
    message: "Do you ship to Cairo? How long does it take?",
    read: false,
    createdAt: "2026-08-11T11:30:00Z",
    updatedAt: "2026-08-11T11:30:00Z",
  },
  {
    id: 6,
    name: "Lina K.",
    email: "lina@example.com",
    subject: "Order status",
    message: "My order #99 hasn't shipped yet, can you check?",
    read: true,
    readAt: "2026-08-11T12:00:00Z",
    createdAt: "2026-08-11T09:00:00Z",
    updatedAt: "2026-08-11T12:00:00Z",
  },
  {
    id: 5,
    name: "Omar F.",
    email: "omar@example.com",
    subject: "Refund request",
    message: "I'd like a refund for a damaged item.",
    read: true,
    readAt: "2026-08-10T16:00:00Z",
    createdAt: "2026-08-10T15:20:00Z",
    updatedAt: "2026-08-10T16:00:00Z",
  },
];

export const latestContactMessages = contactMessages.slice(0, 2);

export const homeData = {
  categories: categories,
  featured: products.filter((p) => p.status === "active").slice(0, 4),
  latest: products.filter((p) => p.status === "active").slice(0, 4),
};

export const statsData: StatsDto = {
  usersTotal: 12,
  onlineUsers: 3,
  productsTotal: 34,
  categoriesTotal: 8,
  inStock: 28,
  outOfStock: 4,
  lowStock: 2,
  totalOrders: 27,
  pendingOrders: 2,
  totalRevenue: 12840.5,
  averageOrderValue: 475.6,
  inventoryValue: 89210.25,
  averagePrice: 42.5,
};

export const activityResponse: ActivitySummaryDto[] = activityEntries;

export function paginated<T>(data: T[], page = 1, limit = 10, total = data.length) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    data,
    meta: { page, limit, total, totalPages },
  };
}