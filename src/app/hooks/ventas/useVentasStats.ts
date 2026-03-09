"use client";

import { useQuery } from '@tanstack/react-query';
import { ventasService } from '@/app/services/venta.service';
import { ventasKeys } from './useVentas';

/**
 * Hook para obtener estadísticas globales de ventas (sin filtros).
 * Los headers de stats muestran siempre el total general; la tabla usa sus propios filtros.
 */
export function useVentasStats() {
  const query = useQuery({
    queryKey: [...ventasKeys.all, 'stats', 'global'],
    queryFn: () => ventasService.getStats({}),
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

