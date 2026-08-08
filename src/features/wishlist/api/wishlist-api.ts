import { apiFetch } from "@/lib/api-client";
import type { Paginated, PaginationParams } from "@/lib/pagination";
import type {
  AddWishlistItemPayload,
  WishlistItem,
} from "../types/wishlist-types";

export const wishlistApi = {
  getMine: ({ page = 1, limit = 10 }: PaginationParams = {}) =>
    apiFetch<Paginated<WishlistItem>>(
      `/wishlist?page=${page}&limit=${limit}`,
      { method: "GET" },
    ),
  add: (data: AddWishlistItemPayload) =>
    apiFetch<WishlistItem>("/wishlist", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  remove: (productId: number) =>
    apiFetch<{ message: string }>(`/wishlist/${productId}`, {
      method: "DELETE",
    }),
};
