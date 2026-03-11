'use client';

import { useQuery } from '@tanstack/react-query';
import { listaPrecioService } from '@/app/services/lista-precio.service';

export const listasPrecioKeys = {
  all: ['listas-precio'] as const,
  list: (activoOnly: boolean) => [...listasPrecioKeys.all, activoOnly] as const,
};

/** Para admin Utilidades: todas las listas (activoOnly = false). Para selectores usar true. */
export function useListasPrecio(activoOnly: boolean = false) {
  const query = useQuery({
    queryKey: listasPrecioKeys.list(activoOnly),
    queryFn: () => listaPrecioService.getAll(activoOnly),
    staleTime: 1000 * 60 * 5,
  });

  return {
    listas: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
