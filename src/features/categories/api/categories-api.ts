import {
  categoriesControllerCreate,
  categoriesControllerFindAll,
  categoriesControllerFindAllPage,
  categoriesControllerRemove,
  categoriesControllerUpdate,
} from '@/lib/generated/api';
import type { CreateCategoryDto, UpdateCategoryDto } from '../types/category-types';

export interface GetAllPageParams {
  page: number;
  limit: number;
  search?: string;
}

export const categoriesApi = {
  getAll: () => categoriesControllerFindAll(),
  getAllPage: ({ page, limit, search }: GetAllPageParams) =>
    categoriesControllerFindAllPage({ page, limit, search }),
  create: (data: CreateCategoryDto) => categoriesControllerCreate(data),
  update: (id: number, data: UpdateCategoryDto) => categoriesControllerUpdate(id, data),
  remove: (id: number) => categoriesControllerRemove(id),
};
