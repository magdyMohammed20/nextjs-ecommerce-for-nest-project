import { http, HttpResponse, delay } from "msw";
import { API_URL } from "@/lib/env";
import {
  products,
  categories,
  users,
  faqItems,
  orders,
  adminUser,
  orderSummaries,
  orderStats,
  orderAdminStats,
  activityEntries,
  contactMessages,
  latestContactMessages,
  homeData,
  statsData,
  paginated,
} from "@/test-utils/fixtures";

const base = API_URL;

let mockDelay: number | "infinite" = 150;

export function setMockDelay(value: number | "infinite") {
  mockDelay = value;
}

async function envelope<T>(
  body: T,
  { status = 200, wait }: { status?: number; wait?: number | "infinite" } = {},
) {
  await delay(wait ?? mockDelay);
  return HttpResponse.json({ data: body }, { status });
}

export const mockError = (message = "Internal server error") =>
  HttpResponse.json(
    { statusCode: 500, message, path: "/mock", timestamp: new Date().toISOString() },
    { status: 500 },
  );

export const mockLoading = () => delay("infinite");

export const defaultHandlers = [
  http.get(`${base}/user/me`, () => envelope(adminUser, { wait: 300 })),

  http.get(`${base}/products`, () => envelope(paginated(products), { wait: 400 })),
  http.get(`${base}/products/mine`, () => envelope(paginated(products.slice(0, 3)), { wait: 400 })),
  http.get(`${base}/products/:id`, ({ params }) => {
    const product = products.find((p) => p.id === Number(params.id));
    return product
      ? envelope(product)
      : HttpResponse.json({ statusCode: 404, message: "Product not found" }, { status: 404 });
  }),

  http.get(`${base}/categories`, () => envelope(categories, { wait: 250 })),
  http.get(`${base}/categories/paginated`, () => envelope(paginated(categories))),

  http.get(`${base}/faq`, () => envelope(faqItems.filter((f) => f.isActive))),
  http.get(`${base}/faq/manage`, () => envelope(faqItems)),

  http.get(`${base}/orders`, () => envelope(paginated(orders))),
  http.get(`${base}/orders/mine`, () => envelope(paginated(orders))),
  http.get(`${base}/orders/latest`, () => envelope(orderSummaries)),
  http.get(`${base}/orders/mine/stats`, () => envelope(orderStats)),
  http.get(`${base}/orders/stats`, () => envelope(orderAdminStats)),
  http.get(`${base}/orders/:id`, ({ params }) => {
    const order = orders.find((o) => o.id === Number(params.id));
    return order
      ? envelope(order)
      : HttpResponse.json({ statusCode: 404, message: "Order not found" }, { status: 404 });
  }),

  http.get(`${base}/activity/latest`, () => envelope(activityEntries)),

  http.get(`${base}/contact`, () => envelope(paginated(contactMessages))),
  http.get(`${base}/contact/latest`, () => envelope(latestContactMessages)),
  http.get(`${base}/contact/unread-count`, () => envelope({ unread: 1 })),

  http.get(`${base}/stats`, () => envelope(statsData)),

  http.get(`${base}/user`, () => envelope(paginated(users))),
  http.get(`${base}/user/:id`, ({ params }) => {
    const user = users.find((u) => u.id === Number(params.id));
    return user
      ? envelope(user)
      : HttpResponse.json({ statusCode: 404, message: "User not found" }, { status: 404 });
  }),

  http.get(`${base}/home`, () => envelope(homeData)),

  http.get(`${base}/cart`, () =>
    envelope({ items: [], total: 0 }, { wait: 200 }),
  ),
  http.get(`${base}/wishlist`, () => envelope(paginated([]))),
  http.get(`${base}/reviews/mine`, () => envelope(paginated([]))),

  http.post(`${base}/user/login`, () => envelope(adminUser)),
  http.post(`${base}/user/logout`, () => envelope({ message: "Logged out" })),
  http.post(`${base}/user/register`, () => envelope({ message: "Registered" })),
  http.post(`${base}/user/heartbeat`, () => envelope({ online: true })),
  http.post(`${base}/contact`, () =>
    envelope({
      id: 99,
      name: "New Visitor",
      email: "visitor@example.com",
      subject: "Thanks",
      message: "Just submitted",
      isRead: false,
      createdAt: new Date().toISOString(),
    }),
  ),
  http.post(`${base}/products/submit`, () => envelope(products[5])),
  http.post(`${base}/orders/mine/:id/cancel`, () => envelope(orders[0])),
  http.post(`${base}/wishlist`, () => envelope({ id: 1, productId: 1 })),
  http.post(`${base}/cart`, () => envelope({ items: [], total: 0 })),

  http.patch(`${base}/orders/:id/status`, () => envelope(orders[0])),
  http.patch(`${base}/contact/:id/read`, () => envelope(contactMessages[0])),
  http.patch(`${base}/contact/read-all`, () => envelope({ updated: 2 })),
  http.patch(`${base}/user/:id/status`, () => envelope(users[1])),
  http.patch(`${base}/categories/:id`, ({ params }) =>
    envelope({ ...categories[0], id: Number(params.id) })),
  http.patch(`${base}/faq/:id`, ({ params }) =>
    envelope({ ...faqItems[0], id: Number(params.id) })),
  http.patch(`${base}/products/:id`, ({ params }) =>
    envelope({ ...products[0], id: Number(params.id) })),
  http.patch(`${base}/products/:id/status`, () => envelope({ ...products[0], status: "approved" })),
  http.patch(`${base}/user/me`, () => envelope(adminUser)),

  http.delete(`${base}/contact/:id`, () => envelope({ message: "Deleted" })),
  http.delete(`${base}/faq/:id`, () => envelope({ message: "Deleted" })),
  http.delete(`${base}/categories/:id`, () => envelope({ message: "Deleted" })),
  http.delete(`${base}/products/:id`, () => envelope({ message: "Deleted" })),
  http.delete(`${base}/user/:id`, () => envelope({ message: "Deleted" })),
  http.delete(`${base}/cart`, () => envelope({ message: "Cleared" })),
  http.delete(`${base}/cart/:productId`, () => envelope({ message: "Removed" })),
  http.delete(`${base}/wishlist/:productId`, () => envelope({ message: "Removed" })),

  http.post(`${base}/products/upload`, () =>
    envelope({ url: "https://picsum.photos/seed/uploaded/640/400" })),
  http.post(`${base}/user/avatar/upload`, () => envelope({ url: "https://picsum.photos/seed/avatar/200" })),
  http.post(`${base}/contact/:id/reply`, () =>
    envelope({ id: 7, message: "Reply queued for delivery" })),
];

export const apiUrl = base;