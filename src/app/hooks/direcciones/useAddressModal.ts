import { useState, useCallback } from 'react';

export function useAddressModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [direccionToDelete, setDireccionToDelete] = useState<string | null>(null);

  const openModal = useCallback((id: string) => {
    setDireccionToDelete(id);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setDireccionToDelete(null);
  }, []);

  const confirmDelete = useCallback((onConfirm: (id: string) => void) => {
    if (direccionToDelete) {
      onConfirm(direccionToDelete);
      closeModal();
    }
  }, [direccionToDelete, closeModal]);

  return {
    isOpen,
    direccionToDelete,
    openModal,
    closeModal,
    confirmDelete,
  };
}

