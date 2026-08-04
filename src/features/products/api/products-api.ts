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
  }: { page?: number; limit?: number; search?: string } = {}) =>
    productsControllerFindAll({ page, limit, search }),
  getById: (id: number) => productsControllerFindOne(id),
  create: (data: CreateProductPayload) => productsControllerCreate(data),
  update: (id: number, data: UpdateProductPayload) =>
    productsControllerUpdate(id, data),
  remove: (id: number) => productsControllerRemove(id),
  uploadImage: (file: File) => productsControllerUpload({ file }),
};
