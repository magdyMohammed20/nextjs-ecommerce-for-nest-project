import { statsControllerGetStats } from '@/lib/generated/api';

export const statsApi = {
  getStats: () => statsControllerGetStats(),
};
