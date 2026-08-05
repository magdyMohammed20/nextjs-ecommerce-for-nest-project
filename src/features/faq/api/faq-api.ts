import {
  faqControllerCreate,
  faqControllerFindActive,
  faqControllerFindAll,
  faqControllerRemove,
  faqControllerUpdate,
} from "@/lib/generated/api";
import type {
  CreateFaqPayload,
  UpdateFaqPayload,
} from "../types/faq-types";

export const faqApi = {
  getActive: () => faqControllerFindActive(),
  getManage: () => faqControllerFindAll(),
  create: (data: CreateFaqPayload) => faqControllerCreate(data),
  update: (id: number, data: UpdateFaqPayload) => faqControllerUpdate(id, data),
  remove: (id: number) => faqControllerRemove(id),
};
