"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi, type ProductsQuery } from "../api/products-api";
import { productsQueryKeys } from "../api/queryKeys";
import type {
  CreateProductPayload,
  SubmitProductPayload,
  UpdateProductPayload,
  UpdateProductStatusPayload,
} from "../types/product-types";

export function useProducts(params: ProductsQuery = {}, refetchInterval: number | false = false) {
  return useQuery({
    queryKey: productsQueryKeys.list(params),
    queryFn: () => productsApi.getAll(params),
    placeholderData: keepPreviousData,
    refetchInterval,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productsQueryKeys.detail(id),
    queryFn: () => productsApi.getById(id),
    enabled: Number.isFinite(id),
  });
}

export function useProductsMine(
  params: { page?: number; limit?: number; status?: string } = {},
) {
  return useQuery({
    queryKey: productsQueryKeys.mine(params),
    queryFn: () => productsApi.getMine(params),
    placeholderData: keepPreviousData,
  });
}

export function useProductUsage(id: number) {
  return useQuery({
    queryKey: productsQueryKeys.usage(id),
    queryFn: () => productsApi.getUsage(id),
    enabled: Number.isFinite(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductPayload) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
    },
  });
}

export function useSubmitProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SubmitProductPayload) => productsApi.submit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
    },
  });
}

export function useUpdateProduct(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProductPayload) => productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.detail(id) });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductStatusPayload }) =>
      productsApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
    },
  });
}

export function useRemoveProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
    },
  });
}
