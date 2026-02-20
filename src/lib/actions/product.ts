import { get, post, put, del } from '../axios-handler';
import type { ProductInterface } from '../../store/product-store';

export interface ProductParams {
  search?: string;
  skip?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ProductListResponse {
  data: ProductInterface[];
  total: number;
  skip: number;
  limit: number;
}

export const productApi = {
  getAll: (params?: ProductParams) => {
    const query: Record<string, unknown> = {};

    if (params?.search) query.search = params.search;
    if (params?.skip) query.page = params.skip;
    if (params?.limit) query.limit = params.limit;
    if (params?.sortBy) query.sortBy = params.sortBy;
    if (params?.order) query.order = params.order;

    return get<ProductListResponse>('/products', query);
  },

  getById: (id: string) => get<ProductInterface>(`/products/${id}`),

  create: (product: Partial<ProductInterface>) =>
    post<ProductInterface>('/products', product),

  update: (id: string, product: Partial<ProductInterface>) =>
    put<ProductInterface>(`/products/${id}`, product),

  delete: (id: string) => del<{ success: boolean }>(`/products/${id}`),
};
