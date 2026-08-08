import {
  productsControllerCreate,
  productsControllerFindAll,
  productsControllerFindOne,
  productsControllerRemove,
  productsControllerSubmit,
  productsControllerFindMine,
  productsControllerUpdateStatus,
  productsControllerUpdate,
  productsControllerUpload,
} from "@/lib/generated/api";
import { apiFetch } from "@/lib/api-client";
import type {
  CreateProductPayload,
  SubmitProductPayload,
  UpdateProductPayload,
  UpdateProductStatusPayload,
} from "../types/product-types";

export interface ProductOrderUsage {
  orderCount: number;
  itemCount: number;
}

export interface ProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const productsApi = {
  getAll: ({
    page = 1,
    limit = 10,
    search = "",
    categoryIds,
    minPrice,
    maxPrice,
    status,
    sortBy,
    sortOrder,
  }: ProductsQuery = {}) =>
    productsControllerFindAll({
      page,
      limit,
      search,
      categories:
        categoryIds && categoryIds.length > 0
          ? categoryIds.join(",")
          : undefined,
      minPrice: minPrice !== undefined ? String(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? String(maxPrice) : undefined,
      status,
      sortBy,
      sortOrder,
    }),
  getById: (id: number) => productsControllerFindOne(id),
  create: (data: CreateProductPayload) => productsControllerCreate(data),
  submit: (data: SubmitProductPayload) => productsControllerSubmit(data),
  update: (id: number, data: UpdateProductPayload) =>
    productsControllerUpdate(id, data),
  updateStatus: (id: number, data: UpdateProductStatusPayload) =>
    productsControllerUpdateStatus(id, data),
  remove: (id: number) => productsControllerRemove(id),
  uploadImage: (file: File) => productsControllerUpload({ file }),
  getUsage: (id: number) =>
    apiFetch<ProductOrderUsage>(`/products/${id}/usage`),
  getMine: ({
    page = 1,
    limit = 10,
    status,
  }: { page?: number; limit?: number; status?: string } = {}) =>
    productsControllerFindMine({ page, limit, status }),
};
