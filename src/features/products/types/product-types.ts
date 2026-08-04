import type { CreateProductDto } from "@/lib/generated/api";

export type {
  CreateProductDto,
  MessageDto,
  PaginationMetaDto,
  Product,
  ProductPageDto,
  UploadResponseDto,
} from "@/lib/generated/api";

export type CreateProductPayload = CreateProductDto;
export type UpdateProductPayload = Partial<CreateProductDto>;
