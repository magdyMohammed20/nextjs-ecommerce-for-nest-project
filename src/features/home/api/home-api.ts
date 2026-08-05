import { homeControllerGetHome } from '@/lib/generated/api';

export const homeApi = {
  getHome: () => homeControllerGetHome(),
};
