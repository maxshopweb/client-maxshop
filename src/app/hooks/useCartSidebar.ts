"use client";

import { useCartSidebarStore } from "@/app/stores/cartSidebarStore";

export function useCartSidebar() {
  const isOpen = useCartSidebarStore((state) => state.isOpen);
  const open = useCartSidebarStore((state) => state.open);
  const close = useCartSidebarStore((state) => state.close);
  const toggle = useCartSidebarStore((state) => state.toggle);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}

