/**
 * Carga las ventas recientes como notificaciones al entrar al panel admin.
 * Así las ventas que ocurrieron antes de abrir el panel (o antes de conectar el WS) también aparecen.
 */

import { useEffect, useRef } from 'react';
import { ventasService } from '@/app/services/venta.service';
import { useNotificationsStore } from '@/app/stores/notificationsStore';
import { useAuth } from '@/app/context/AuthContext';
import type { IVenta } from '@/app/types/ventas.type';
import type { SaleNotification } from '@/app/stores/notificationsStore';

const LIMIT_RECENT = 20;

function ventaToNotification(venta: IVenta): Omit<SaleNotification, 'isRead' | 'created_at'> {
  const fecha = venta.fecha
    ? (typeof venta.fecha === 'string' ? venta.fecha : venta.fecha.toISOString())
    : (venta.creado_en
      ? (typeof venta.creado_en === 'string' ? venta.creado_en : venta.creado_en.toISOString())
      : new Date().toISOString());
  const cliente =
    venta.cliente?.usuario?.nombre || venta.cliente?.usuario?.apellido
      ? [venta.cliente.usuario.nombre, venta.cliente.usuario.apellido].filter(Boolean).join(' ').trim()
      : venta.cliente?.usuario?.email ?? 'Cliente invitado';
  const producto =
    venta.detalles?.length && venta.detalles[0]?.producto?.nombre
      ? venta.detalles.length === 1
        ? venta.detalles[0].producto!.nombre
        : `${venta.detalles.length} productos`
      : undefined;
  return {
    id_venta: venta.id_venta,
    cod_interno: venta.cod_interno ?? null,
    estado_pago: (venta.estado_pago as 'pendiente' | 'aprobado' | 'cancelado') ?? 'pendiente',
    fecha,
    cliente: cliente || undefined,
    producto,
    total: venta.total_neto ?? undefined,
  };
}

export function useInitialNotifications() {
  const { user } = useAuth();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (user?.rol !== 'ADMIN') {
      return;
    }
    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;

    ventasService
      .getAll({
        limit: LIMIT_RECENT,
        page: 1,
        order_by: 'fecha',
        order: 'desc',
      })
      .then((res) => {
        const ventas: IVenta[] = res.data ?? [];
        ventas.forEach((venta) => {
          addNotification(ventaToNotification(venta), { silent: true });
        });
      })
      .catch(() => {
        hasLoadedRef.current = false; // permitir reintento en siguiente mount
      });
  }, [user?.rol, addNotification]);
}
