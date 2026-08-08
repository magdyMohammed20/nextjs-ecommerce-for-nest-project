import { activityControllerFindLatest } from "@/lib/generated/api";

export const activityApi = {
  getLatest: (limit = 8) => activityControllerFindLatest({ limit }),
};
