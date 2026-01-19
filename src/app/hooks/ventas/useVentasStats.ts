"use client";

import { useQuery } from '@tanstack/react-query';
import { useVentasFilters } from './useVentasFilters';
import { ventasService } from '@/app/services/venta.service';
import { ventasKeys } from './useVentas';

/**
 * Hook para obtener estadísticas de ventas
 * Usa un endpoint específico que calcula estadísticas usando agregaciones SQL
 * sin necesidad de traer todos los registros
 */
export function useVentasStats() {
  const { filters } = useVentasFilters();

  // Remover page y limit de los filtros para estadísticas (no son necesarios)
  const statsFilters = {
    busqueda: filters.busqueda,
    id_cliente: filters.id_cliente,
    id_usuario: filters.id_usuario,
    fecha_desde: filters.fecha_desde,
    fecha_hasta: filters.fecha_hasta,
    estado_pago: filters.estado_pago,
    estado_envio: filters.estado_envio,
    metodo_pago: filters.metodo_pago,
    tipo_venta: filters.tipo_venta,
    total_min: filters.total_min,
    total_max: filters.total_max,
  };

  const query = useQuery({
    queryKey: [...ventasKeys.all, 'stats', statsFilters],
    queryFn: () => ventasService.getStats(statsFilters),
    staleTime: 0, // Siempre considerar los datos como stale para obtener datos frescos
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnMount: 'always', // Siempre refetch al montar
    refetchOnWindowFocus: false,
  });

  return {
    totalVentas: query.data?.totalVentas ?? 0,
    totalVendido: query.data?.totalVendido ?? 0,
    promedioVenta: query.data?.promedioVenta ?? 0,
    ventasAprobadas: query.data?.ventasAprobadas ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

