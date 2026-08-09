import type { CreateContactMessageDto } from "@/lib/generated/api";

export type {
  ContactDeleteDto,
  ContactMessage,
  ContactMessagePageDto,
  ContactReplyDto,
  CreateContactMessageDto,
  UnreadCountDto,
  UpdatedCountDto,
} from "@/lib/generated/api";

export type ContactSubmitPayload = CreateContactMessageDto;

export type ContactMessageFilters = {
  page?: number;
  limit?: number;
  read?: boolean;
  search?: string;
};
