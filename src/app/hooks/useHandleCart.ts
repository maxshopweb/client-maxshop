"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/stores/cartStore";
import { useState } from "react";

export const useHandleCart = (onClose?: () => void) => {
  const router = useRouter();
  const { removeItem, updateQuantity, clearCart } = useCartStore();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleVerCarrito = () => {
    onClose?.();
    router.push("/checkout?step=1");
  };

  const handleEliminarItem = (id: number) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete !== null) {
      removeItem(itemToDelete);
      setItemToDelete(null);
    }
    setShowDeleteModal(false);
  };

  const handleVaciarCarrito = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  const incrementar = (id: number, cantidad: number) => {
    updateQuantity(id, cantidad + 1);
  };

  const decrementar = (id: number, cantidad: number) => {
    if (cantidad > 1) {
      updateQuantity(id, cantidad - 1);
    } else {
      handleEliminarItem(id);
    }
  };

  return {
    // handlers
    handleVerCarrito,
    handleEliminarItem,
    handleVaciarCarrito,
    incrementar,
    decrementar,
    confirmDeleteItem,
    confirmClearCart,

    // estado de modales
    showDeleteModal,
    showClearModal,
    itemToDelete,
    closeDeleteModal: () => {
      setShowDeleteModal(false);
      setItemToDelete(null);
    },
    closeClearModal: () => setShowClearModal(false),
  };
};
