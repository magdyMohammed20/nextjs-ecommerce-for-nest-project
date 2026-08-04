import { apiFetch } from "@/lib/api-client";
import { getToken } from "@/lib/auth/client";
import { API_URL } from "@/lib/env";
import type { Paginated, PaginationParams } from "@/lib/pagination";
import {
  CreateProductPayload,
  Product,
  UpdateProductPayload,
} from "../types/product-types";

export interface UploadImageResponse {
  url: string;
}

export const productsApi = {
  getAll: ({ page = 1, limit = 10, search = "" }: PaginationParams = {}) =>
    apiFetch<Paginated<Product>>(
      `/products?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      { method: "GET" },
    ),
  getById: (id: number) => apiFetch<Product>(`/products/${id}`, { method: "GET" }),
  create: (data: CreateProductPayload) =>
    apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: UpdateProductPayload) =>
    apiFetch<Product>(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) =>
    apiFetch<{ message: string }>(`/products/${id}`, { method: "DELETE" }),
  uploadImage: async (file: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/products/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
      cache: "no-store",
    });

    if (!res.ok) {
      let message = `Upload failed with status ${res.status}`;
      try {
        const body = await res.json();
        const field = body?.message;
        message = Array.isArray(field) ? field.join(", ") : (field ?? message);
      } catch {
        // keep default message
      }
      throw new Error(message);
    }

    return (await res.json()) as UploadImageResponse;
  },
};
