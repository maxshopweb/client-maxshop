import { create } from 'zustand';

interface CartSidebarState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useCartSidebarStore = create<CartSidebarState>((set, get) => ({
  isOpen: false,
  open: () => {
    set({ isOpen: true });
  },
  close: () => {
    set({ isOpen: false });
  },
  toggle: () => {
    const { isOpen } = get();
    if (isOpen) {
      get().close();
    } else {
      get().open();
    }
  },
}));

