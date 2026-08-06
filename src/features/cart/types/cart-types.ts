import type {
  CartDto,
  AdminCartDto,
  AdminCartPageDto,
  CreateCartItemDto,
} from "@/lib/generated/api";

export type { CartDto, CartItemDto } from "@/lib/generated/api";
export type { AdminCartDto, AdminCartPageDto } from "@/lib/generated/api";
export type { CreateCartItemDto, UpdateCartItemDto } from "@/lib/generated/api";

export type Cart = CartDto;
export type AdminCart = AdminCartDto;
export type AdminCartPage = AdminCartPageDto;
export type AddToCartPayload = CreateCartItemDto;
