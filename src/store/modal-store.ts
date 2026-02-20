import { create } from 'zustand';
import type { ProductInterface } from './product-store';

type ModalPayload =
  | { type: 'create' }
  | { type: 'edit'; product: ProductInterface }
  | { type: 'delete'; product: ProductInterface }
  | { type: 'view'; product: ProductInterface }
  | null;

interface ModalState {
  modal: ModalPayload;
  openModal: (payload: NonNullable<ModalPayload>) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  modal: null,
  openModal: (payload) => set({ modal: payload }),
  closeModal: () => set({ modal: null }),
}));
