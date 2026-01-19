"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVentas } from './useVentas';
import { useVentasFilters } from './useVentasFilters';
import { useNotificationsStore } from '@/app/stores/notificationsStore';
import type { IVenta } from '@/app/types/ventas.type';

type ModalType = 'create' | 'edit' | 'delete' | 'view' | 'bulk-delete' | null;

interface ModalState {
  type: ModalType;
  venta?: IVenta;
}

/**
 * Hook principal para manejar toda la lógica de la página de ventas
 * Incluye: estado de modales, operaciones, y datos
 */
export function useVentasPage() {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [bulkDeleteIds, setBulkDeleteIds] = useState<number[]>([]);
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const { filters } = useVentasFilters();
  const { ventas, pagination, refetch, isFetching } = useVentas({ filters });
  const { clearNotifications } = useNotificationsStore();

  // Limpiar notificaciones al entrar a esta página
  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  // Funciones para abrir modales
  const openCreateModal = useCallback(() => {
    setModal({ type: 'create' });
  }, []);

  const openEditModal = useCallback((venta: IVenta) => {
    setModal({ type: 'edit', venta });
  }, []);

  const openDeleteDialog = useCallback((venta: IVenta) => {
    setModal({ type: 'delete', venta });
  }, []);

  const openViewDialog = useCallback((venta: IVenta) => {
    setModal({ type: 'view', venta });
  }, []);

  const openBulkDeleteDialog = useCallback((ids: number[]) => {
    setBulkDeleteIds(ids);
    setModal({ type: 'bulk-delete' });
  }, []);

  // Función para cerrar modales
  const closeModal = useCallback(() => {
    setModal({ type: null });
    setBulkDeleteIds([]);
  }, []);

  return {
    // Estado de modales
    modal,
    bulkDeleteIds,
    highlightId: highlightId ? parseInt(highlightId, 10) : undefined,

    // Datos
    ventas,
    pagination,
    isFetching,

    // Acciones de modales
    openCreateModal,
    openEditModal,
    openDeleteDialog,
    openViewDialog,
    openBulkDeleteDialog,
    closeModal,

    // Acciones de datos
    refetch,
  };
}

