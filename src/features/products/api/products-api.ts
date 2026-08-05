import {
  productsControllerCreate,
  productsControllerFindAll,
  productsControllerFindOne,
  productsControllerRemove,
  productsControllerUpdate,
  productsControllerUpload,
} from "@/lib/generated/api";
import type {
  CreateProductPayload,
  UpdateProductPayload,
} from "../types/product-types";

export const productsApi = {
  getAll: ({
    page = 1,
    limit = 10,
    search = "",
    categoryIds,
    minPrice,
    maxPrice,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    categoryIds?: number[];
    minPrice?: number;
    maxPrice?: number;
  } = {}) =>
    productsControllerFindAll({
      page,
      limit,
      search,
      categories:
        categoryIds && categoryIds.length > 0 ? categoryIds.join(",") : undefined,
      minPrice: minPrice !== undefined ? String(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? String(maxPrice) : undefined,
    }),
  getById: (id: number) => productsControllerFindOne(id),
  create: (data: CreateProductPayload) => productsControllerCreate(data),
  update: (id: number, data: UpdateProductPayload) =>
    productsControllerUpdate(id, data),
  remove: (id: number) => productsControllerRemove(id),
  uploadImage: (file: File) => productsControllerUpload({ file }),
};
