import { get, post, patch, del } from '@/lib/axios-handler';
import type { ProductInterface } from '@/store/product-store';

export interface ProductParams {
  search?: string;
  skip?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ProductListResponse {
  products: ProductInterface[];
  total: number;
  skip: number;
  limit: number;
}

export const productApi = {
  getAll: (params?: ProductParams) => {
    const query: Record<string, unknown> = {};
    if (params?.skip) query.skip = params.skip;
    if (params?.limit) query.limit = params.limit;
    if (params?.sortBy) query.sortBy = params.sortBy;
    if (params?.order) query.order = params.order;
    return get<ProductListResponse>('/products', query);
  },

  search: (q: string, params?: Omit<ProductParams, 'search'>) => {
    const query: Record<string, unknown> = { q };
    if (params?.skip) query.skip = params.skip;
    if (params?.limit) query.limit = params.limit;
    if (params?.sortBy) query.sortBy = params.sortBy;
    if (params?.order) query.order = params.order;
    return get<ProductListResponse>('/products/search', query);
  },

  getById: (id: number) => get<ProductInterface>(`/products/${id}`),

  getCategories: () => get<string[]>('/products/category-list'),

  getByCategory: (category: string, params?: ProductParams) => {
    const query: Record<string, unknown> = {};
    if (params?.skip) query.skip = params.skip;
    if (params?.limit) query.limit = params.limit;
    return get<ProductListResponse>(`/products/category/${category}`, query);
  },

  create: (product: Partial<ProductInterface>) =>
    post<ProductInterface>('/products/add', product),

  update: (id: number, product: Partial<ProductInterface>) =>
    patch<ProductInterface>(`/products/${id}`, product),

  delete: (id: number) =>
    del<ProductInterface & { isDeleted: boolean; deletedOn: string }>(
      `/products/${id}`
    ),
};
