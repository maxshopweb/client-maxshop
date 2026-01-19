import { useState, useCallback } from 'react';
import type { IDireccion } from '@/app/services/direcciones.service';

const ANIMATION_DURATION = 300;

export function useAddressEdit() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [closingId, setClosingId] = useState<string | null>(null);

  const startEdit = useCallback((direccion: IDireccion) => {
    setEditingId(direccion.id_direccion);
    setShowAddForm(false);
  }, []);

  const startAdd = useCallback(() => {
    setShowAddForm(true);
    setEditingId(null);
  }, []);

  const cancel = useCallback((onCancel?: () => void) => {
    const currentEditingId = editingId;
    setIsClosing(true);
    if (currentEditingId) {
      setClosingId(currentEditingId);
    }
    setTimeout(() => {
      setEditingId(null);
      setShowAddForm(false);
      setIsClosing(false);
      setClosingId(null);
      onCancel?.();
    }, ANIMATION_DURATION);
  }, [editingId]);

  const finishEdit = useCallback(() => {
    setEditingId(null);
  }, []);

  const finishAdd = useCallback(() => {
    setShowAddForm(false);
  }, []);

  const isEditing = useCallback((id: string) => {
    return editingId === id || closingId === id;
  }, [editingId, closingId]);

  const getAnimationClass = useCallback((id: string) => {
    if (isClosing && closingId === id) {
      return 'animate-slide-up';
    }
    return 'animate-slide-down';
  }, [isClosing, closingId]);

  return {
    editingId,
    showAddForm,
    isClosing,
    closingId,
    startEdit,
    startAdd,
    cancel,
    finishEdit,
    finishAdd,
    isEditing,
    getAnimationClass,
  };
}

