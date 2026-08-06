"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cart-api";
import type { AddToCartPayload } from "../types/cart-types";
import { useAuth } from "@/features/auth/context/auth-provider";

export const cartQueryKey = ["cart"] as const;

export function useCart() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: cartQueryKey,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: cartQueryKey });

  const addItem = useMutation({
    mutationFn: (payload: AddToCartPayload) => cartApi.addItem(payload),
    onSuccess: invalidate,
  });

  const updateQuantity = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.updateQuantity(productId, { quantity }),
    onSuccess: invalidate,
  });

  const removeItem = useMutation({
    mutationFn: (productId: number) => cartApi.removeItem(productId),
    onSuccess: invalidate,
  });

  const clearCart = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: invalidate,
  });

  return {
    cart: data,
    isLoading,
    isError,
    error,
    refetch,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems: data?.totalItems ?? 0,
  };
}

export function useAdminCarts(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["admin-carts", page, limit],
    queryFn: () => cartApi.adminList(page, limit),
  });
}
