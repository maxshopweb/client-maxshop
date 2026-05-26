"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVentas } from './useVentas';
import { useVentasFilters } from './useVentasFilters';
import { useUpdateEstadoPago, useAprobarDesdeVencido } from './useVentasMutations';
import { useNotificationsStore } from '@/app/stores/notificationsStore';
import type { IVenta } from '@/app/types/ventas.type';
import type { EstadoPago } from '@/app/types/estados.type';

type ModalType = 'create' | 'edit' | 'delete' | 'view' | 'bulk-delete' | 'enviar-factura' | null;

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
  const { updateEstadoPago, updateEstadoPagoAsync, isUpdating: isUpdatingEstadoPago } = useUpdateEstadoPago();
  const { aprobarDesdeVencido, aprobarDesdeVencidoAsync, isAprobando } = useAprobarDesdeVencido();

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

  const openEnviarFacturaModal = useCallback((venta: IVenta) => {
    setModal({ type: 'enviar-factura', venta });
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

  /**
   * Cambia el estado de pago de una venta.
   * Si la venta está vencida y el nuevo estado es aprobado, usa aprobarDesdeVencido (descuenta stock, envía email).
   */
  const changeEstadoPago = useCallback(
    async (venta: IVenta, nuevoEstado: string) => {
      if (venta.estado_pago === 'vencido' && nuevoEstado === 'aprobado') {
        await aprobarDesdeVencidoAsync(venta.id_venta);
      } else {
        await updateEstadoPagoAsync({ id: venta.id_venta, estado: nuevoEstado as EstadoPago });
      }
    },
    [aprobarDesdeVencidoAsync, updateEstadoPagoAsync]
  );

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
    openEnviarFacturaModal,
    openBulkDeleteDialog,
    closeModal,

    // Acciones de datos
    refetch,

    // Cambio de estado de pago (elige aprobarDesdeVencido o updateEstadoPago según corresponda)
    changeEstadoPago,
    updateEstadoPago,
    updateEstadoPagoAsync,
    aprobarDesdeVencido,
    aprobarDesdeVencidoAsync,
    isUpdatingEstadoPago,
    isAprobando,
  };
}

