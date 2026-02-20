import { get } from '@/lib/axios-handler';

export interface CategoryInterface {
  slug: string;
  name: string;
  url: string;
}

export const categoryApi = {
  getAll: () => get<CategoryInterface[]>('/products/categories'),
};
