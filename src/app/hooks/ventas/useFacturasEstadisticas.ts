"use client";

import { useQuery } from '@tanstack/react-query';
import { facturasService } from '@/app/services/facturas.service';

export const facturasKeys = {
  all: ['facturas'] as const,
  estadisticas: () => [...facturasKeys.all, 'estadisticas'] as const,
};

export function useFacturasEstadisticas() {
  const query = useQuery({
    queryKey: facturasKeys.estadisticas(),
    queryFn: () => facturasService.getEstadisticas(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    estadisticas: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
