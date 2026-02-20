import { create } from 'zustand';
import type { ResponseInterface } from '../types/response';
import type { ReviewInterface } from '../types/review';
import type { MetaInterface } from '../types/meta';
import { productApi } from '../lib/actions/product';
import { showAlert } from '../lib/alert';

export interface ProductInterface {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: [];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ReviewInterface[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: MetaInterface;
  thumbnail: string;
  images: string[];
}

export type ProductResponse = ResponseInterface<ProductInterface>;

interface ProductState {
  products: ProductResponse;
  isLoadingProduct: boolean;

  setProduct: (products: ProductResponse) => void;
  setIsLoadingProduct: (isLoadingProduct: boolean) => void;

  fetchProducts: (params?: {
    search?: string;
    limit?: number;
    total?: number;
    skip?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
  }) => Promise<void>;
  createProduct: (Product: Partial<ProductInterface>) => Promise<void>;
  updateProduct: (
    id: string,
    Product: Partial<ProductInterface>
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductstore = create<ProductState>((set, get) => ({
  products: {
    data: [],
    total: 0,
    skip: 10,
    limit: 10,
  },
  isLoadingProduct: false,

  setProduct: (products) => set({ products }),
  setIsLoadingProduct: (isLoadingProduct) => set({ isLoadingProduct }),

  fetchProducts: async (params) => {
    set({ isLoadingProduct: true });
    try {
      const data = await productApi.getAll(params);
      set({ products: data });
    } catch (error) {
      showAlert('error', 'Failed to fetch products')
      throw error;
    } finally {
      set({ isLoadingProduct: false });
    }
  },

  createProduct: async (product) => {
    set({ isLoadingProduct: true });
    try {
      await productApi.create(product);
      showAlert('success', 'Product created successfully')
    } catch(error: unknown) {
      showAlert('error', 'Failed to create products')
      throw error
    } finally {
     await get().fetchProducts(); 
    }
  },

  updateProduct: async (id, product) => {
    set({ isLoadingProduct: true });
    try {
      await productApi.update(id, product);
      showAlert('success', 'Product updated successfully')
    } catch(error: unknown) {
      showAlert('error', 'Failed to update products')
      throw error
    } finally {
      await get().fetchProducts();
    }
  },

  deleteProduct: async (id) => {
    set({ isLoadingProduct: true });
    try {
      await productApi.delete(id);
      showAlert('warning', 'Product deleted successfully')
    } catch(error: unknown) {
      showAlert('error', 'Failed to delete products')
      throw error
    } finally {
      await get().fetchProducts();
    }
  },
}));
