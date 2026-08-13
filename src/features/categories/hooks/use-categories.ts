"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi, type GetAllPageParams } from "../api/categories-api";
import { categoriesQueryKeys } from "../api/queryKeys";
import type { CreateCategoryDto, UpdateCategoryDto } from "../types/category-types";

export function useCategories() {
  return useQuery({
    queryKey: categoriesQueryKeys.all,
    queryFn: categoriesApi.getAll,
  });
}

export function useCategoriesPage(params: GetAllPageParams) {
  return useQuery({
    queryKey: categoriesQueryKeys.page(params),
    queryFn: () => categoriesApi.getAllPage(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useUpdateCategory(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCategoryDto) => categoriesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}

export function useRemoveCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesQueryKeys.all });
    },
  });
}
