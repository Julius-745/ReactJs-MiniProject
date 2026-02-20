import { create } from 'zustand';
import { productApi } from '@/lib/actions/product';
import { showAlert } from '@/lib/alert';
import type { ProductListResponse, ProductParams } from '@/lib/actions/product';

export interface ProductInterface {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}

interface ProductState {
  products: ProductListResponse;
  isLoadingProduct: boolean;
  isMutatingProduct: boolean;
  params: ProductParams;

  setParams: (params: Partial<ProductParams>) => void;
  fetchProducts: (params?: ProductParams) => Promise<void>;
  createProduct: (product: Partial<ProductInterface>) => Promise<void>;
  updateProduct: (
    id: number,
    product: Partial<ProductInterface>
  ) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  fetchTimeout: ReturnType<typeof setTimeout> | null;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: { products: [], total: 0, skip: 0, limit: 10 },
  isLoadingProduct: false,
  isMutatingProduct: false,
  params: { skip: 0, limit: 10 },
  fetchTimeout: null,

  setParams: (newParams) => {
    const currentParams = get().params;
    const merged = { ...currentParams, ...newParams };

    const hasChanged = Object.keys(newParams).some(
      (key) =>
        (newParams as Record<string, unknown>)[key] !==
        (currentParams as Record<string, unknown>)[key]
    );
    if (!hasChanged) return;

    set({ params: merged });

    if (get().fetchTimeout) {
      clearTimeout(get().fetchTimeout!);
      set({ fetchTimeout: null });
    }

    const isSearchChange = 'search' in newParams;

    if (isSearchChange) {
      const timeout = setTimeout(() => {
        get().fetchProducts(merged);
        set({ fetchTimeout: null });
      }, 400);
      set({ fetchTimeout: timeout });
    } else {
      get().fetchProducts(merged);
    }
  },

  fetchProducts: async (params) => {
    set({ isLoadingProduct: true });
    try {
      const p = params ?? get().params;
      const data = p.search
        ? await productApi.search(p.search, p)
        : await productApi.getAll(p);
      set({ products: data });
    } catch (error: any) {
      showAlert('error', error.message, 'Failed to fetch products');
      throw error;
    } finally {
      set({ isLoadingProduct: false });
    }
  },

  createProduct: async (product) => {
    set({ isMutatingProduct: true });
    try {
      const data = await productApi.create(product);
      set((state) => ({
        products: {
          ...state.products,
          products: [data, ...state.products.products],
          total: state.products.total + 1,
        },
      }));
      showAlert('success', 'Product created successfully.');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'An unknown error occurred';
      showAlert('error', message, 'Failed to product action');
      throw error;
    } finally {
      set({ isMutatingProduct: false });
    }
  },

  updateProduct: async (id, product) => {
    set({ isMutatingProduct: true });
    try {
      // Manipulate data locally only to avoid mock persistence issues
      set((state) => ({
        products: {
          ...state.products,
          products: state.products.products.map((p) =>
            p.id === id ? ({ ...p, ...product } as ProductInterface) : p
          ),
        },
      }));

      showAlert('success', 'Product updated successfully.');
    } catch (error: any) {
      showAlert('error', error.message, 'Failed to update product');
      throw error;
    } finally {
      set({ isMutatingProduct: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isMutatingProduct: true });
    try {
      await productApi.delete(id);
      set((state) => ({
        products: {
          ...state.products,
          products: state.products.products.filter((p) => p.id !== id),
          total: state.products.total - 1,
        },
      }));

      showAlert('success', 'Product deleted successfully.');
    } catch (error: any) {
      showAlert('error', error.message, 'Failed to delete product');
      throw error;
    } finally {
      set({ isMutatingProduct: false });
    }
  },
}));
