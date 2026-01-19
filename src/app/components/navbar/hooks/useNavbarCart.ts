"use client";

import { useCartStore } from "@/app/stores/cartStore";
import { useCartSidebar } from "@/app/hooks/useCartSidebar";

export function useNavbarCart() {
  const { summary } = useCartStore();
  const { isOpen, open, close } = useCartSidebar();

  return {
    cantidadItems: summary.cantidadItems,
    openCart: open,
    closeCart: close,
    isCartOpen: isOpen,
  };
}

