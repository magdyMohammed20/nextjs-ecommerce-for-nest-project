import type { PaginationParams } from "@/lib/pagination";

export type UsersListParams = Required<PaginationParams>;

export const usersQueryKeys = {
  all: ["users"] as const,
  lists: () => [...usersQueryKeys.all, "list"] as const,
  list: (params: UsersListParams) => [...usersQueryKeys.lists(), params] as const,
  details: () => [...usersQueryKeys.all, "detail"] as const,
  detail: (id: number) => [...usersQueryKeys.details(), id] as const,
};
