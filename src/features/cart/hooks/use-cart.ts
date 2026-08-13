"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "../api/cart-api";
import { cartQueryKeys } from "../api/queryKeys";
import type { AddToCartPayload, CartDto } from "../types/cart-types";
import type { Product } from "@/features/products/types/product-types";
import { useAuth } from "@/features/auth/context/auth-provider";
import {
  addToGuestCart,
  clearGuestCart,
  getGuestCartSnapshot,
  guestCartToDto,
  mergeGuestCart,
  removeFromGuestCart,
  subscribeGuestCart,
  updateGuestQuantity,
  type GuestCartItem,
} from "../lib/guest-cart";

export const cartQueryKey = cartQueryKeys.all;

export type AddItemPayload = AddToCartPayload & { product?: Product };

const EMPTY_GUEST_ITEMS: GuestCartItem[] = [];

export function useCart() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const guestItems = useSyncExternalStore(
    subscribeGuestCart,
    getGuestCartSnapshot,
    () => EMPTY_GUEST_ITEMS,
  );

  const serverQuery = useQuery({
    queryKey: cartQueryKeys.all,
    queryFn: cartApi.getCart,
    enabled: isAuthenticated,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
  }, [queryClient]);

  // Merge any guest cart into the server cart once the user signs in.
  // Fallback retry: merges any leftover guest cart and refreshes the server
  // cart. The authoritative merge runs inside login() before navigation.
  useEffect(() => {
    if (!isAuthenticated) return;
    mergeGuestCart().finally(() => invalidate());
  }, [isAuthenticated, invalidate]);

  const data = isAuthenticated ? serverQuery.data : guestCartToDto(guestItems);
  const isLoading = isAuthenticated ? serverQuery.isLoading : false;
  const isError = isAuthenticated ? serverQuery.isError : false;
  const error = isAuthenticated ? serverQuery.error : undefined;
  const refetch = serverQuery.refetch;

  const addItem = useMutation({
    mutationFn: (payload: AddItemPayload) => {
      if (isAuthenticated) {
        return cartApi.addItem(payload);
      }
      const next = addToGuestCart(
        payload.productId,
        payload.quantity ?? 1,
        payload.product ?? ({} as Product),
      );
      return Promise.resolve(guestCartToDto(next));
    },
    onSuccess: () => {
      if (isAuthenticated) invalidate();
    },
  });

  const updateQuantity = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => {
      if (isAuthenticated) {
        return cartApi.updateQuantity(productId, { quantity });
      }
      const next = updateGuestQuantity(productId, quantity);
      return Promise.resolve(guestCartToDto(next));
    },
    onSuccess: () => {
      if (isAuthenticated) invalidate();
    },
  });

  const removeItem = useMutation({
    mutationFn: (productId: number) => {
      if (isAuthenticated) {
        return cartApi.removeItem(productId) as Promise<unknown> as Promise<CartDto>;
      }
      const next = removeFromGuestCart(productId);
      return Promise.resolve(guestCartToDto(next));
    },
    onSuccess: () => {
      if (isAuthenticated) invalidate();
    },
  });

  const clearCart = useMutation({
    mutationFn: () => {
      if (isAuthenticated) {
        return cartApi.clearCart() as Promise<unknown> as Promise<CartDto>;
      }
      const next = clearGuestCart();
      return Promise.resolve(guestCartToDto(next));
    },
    onSuccess: () => {
      if (isAuthenticated) invalidate();
    },
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
