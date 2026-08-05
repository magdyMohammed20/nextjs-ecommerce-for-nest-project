import type { CreateFaqDto } from "@/lib/generated/api";

export type {
  CreateFaqDto,
  Faq,
  MessageDto,
  UpdateFaqDto,
} from "@/lib/generated/api";

export type CreateFaqPayload = CreateFaqDto;
export type UpdateFaqPayload = Partial<CreateFaqDto>;
