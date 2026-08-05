import type { CreateProductDto } from "@/lib/generated/api";

export type {
  Category,
  CreateProductDto,
  MessageDto,
  PaginationMetaDto,
  Product,
  ProductPageDto,
  UploadResponseDto,
} from "@/lib/generated/api";

export type CreateProductPayload = CreateProductDto;
export type UpdateProductPayload = Omit<Partial<CreateProductDto>, "categoryId"> & {
  /** `null` clears the product's category back to none. */
  categoryId?: number | null;
};
