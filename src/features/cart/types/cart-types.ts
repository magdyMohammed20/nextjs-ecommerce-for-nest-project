import type {
  CartDto,
  CreateCartItemDto,
} from "@/lib/generated/api";

export type { CartDto, CartItemDto } from "@/lib/generated/api";
export type { CreateCartItemDto, UpdateCartItemDto } from "@/lib/generated/api";

export type Cart = CartDto;
export type AddToCartPayload = CreateCartItemDto;
