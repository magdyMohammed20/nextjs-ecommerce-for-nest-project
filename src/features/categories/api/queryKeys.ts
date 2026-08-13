import type { GetAllPageParams } from "./categories-api";

export const categoriesQueryKeys = {
  all: ["categories"] as const,
  page: (params: GetAllPageParams) => [...categoriesQueryKeys.all, "page", params] as const,
};
