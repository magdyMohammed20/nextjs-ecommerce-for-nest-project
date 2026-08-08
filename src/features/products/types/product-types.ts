import type {
  CreateProductDto,
  ProductStatus,
  SubmitProductDto,
} from "@/lib/generated/api";

export type {
  Category,
  CreateProductDto,
  MessageDto,
  PaginationMetaDto,
  Product,
  ProductPageDto,
  ProductStatus,
  SubmitProductDto,
  UploadResponseDto,
} from "@/lib/generated/api";

export type CreateProductPayload = CreateProductDto;
export type SubmitProductPayload = SubmitProductDto;
export type UpdateProductPayload = Omit<Partial<CreateProductDto>, "categoryId"> & {
  /** `null` clears the product's category back to none. */
  categoryId?: number | null;
};

export type UpdateProductStatusPayload = {
  status: ProductStatus;
  rejectionNote?: string;
};
