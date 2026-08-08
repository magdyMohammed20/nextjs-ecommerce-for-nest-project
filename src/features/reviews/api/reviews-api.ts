import { apiFetch } from "@/lib/api-client";
import type { Paginated, PaginationParams } from "@/lib/pagination";
import type { CreateReviewPayload, ProductReview } from "../types/review-types";

export const reviewsApi = {
  getMine: ({ page = 1, limit = 10 }: PaginationParams = {}) =>
    apiFetch<Paginated<ProductReview>>(
      `/reviews/mine?page=${page}&limit=${limit}`,
      { method: "GET" },
    ),
  upsert: (productId: number, data: CreateReviewPayload) =>
    apiFetch<ProductReview>(`/reviews/${productId}`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  remove: (productId: number) =>
    apiFetch<{ message: string }>(`/reviews/${productId}`, {
      method: "DELETE",
    }),
};
