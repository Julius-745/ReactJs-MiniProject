import { create } from 'zustand';
import { categoryApi } from '@/lib/actions/category';
import type { CategoryInterface } from '@/lib/actions/category';
import { showAlert } from '@/lib/alert';

interface CategoryState {
  categories: CategoryInterface[];
  isLoadingCategory: boolean;
  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoadingCategory: false,

  fetchCategories: async () => {
    if (get().categories.length > 0) return;

    set({ isLoadingCategory: true });
    try {
      const data = await categoryApi.getAll();
      set({ categories: data });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      showAlert('error', message, 'Failed to fetch categories');
      throw error;
    } finally {
      set({ isLoadingCategory: false });
    }
  },
}));
