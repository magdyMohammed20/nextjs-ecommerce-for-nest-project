import type { ProductsQuery } from "./products-api";

export const productsQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productsQueryKeys.all, "list"] as const,
  list: (params: ProductsQuery) => [...productsQueryKeys.lists(), params] as const,
  mine: (params: { page?: number; limit?: number; status?: string }) =>
    [...productsQueryKeys.all, "mine", params] as const,
  details: () => [...productsQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...productsQueryKeys.details(), id] as const,
  usage: (id: number) => [...productsQueryKeys.all, "usage", id] as const,
};
