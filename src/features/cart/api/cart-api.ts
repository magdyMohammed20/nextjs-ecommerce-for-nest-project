import {
  cartControllerAddItem,
  cartControllerClearCart,
  cartControllerGetCart,
  cartControllerRemoveItem,
  cartControllerUpdateQuantity,
} from "@/lib/generated/api";
import type {
  CreateCartItemDto,
  UpdateCartItemDto,
} from "@/lib/generated/api";

export const cartApi = {
  getCart: () => cartControllerGetCart(),
  addItem: (data: CreateCartItemDto) => cartControllerAddItem(data),
  updateQuantity: (productId: number, data: UpdateCartItemDto) =>
    cartControllerUpdateQuantity(productId, data),
  removeItem: (productId: number) => cartControllerRemoveItem(productId),
  clearCart: () => cartControllerClearCart(),
};
