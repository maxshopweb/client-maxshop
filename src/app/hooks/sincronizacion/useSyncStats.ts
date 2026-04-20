"use client";

import { useQuery } from '@tanstack/react-query';
import { sincronizacionService } from '@/app/services/sincronizacion.service';

export const syncKeys = {
  all: ['sincronizacion'] as const,
  stats: () => [...syncKeys.all, 'stats'] as const,
  runs: () => [...syncKeys.all, 'runs'] as const,
  runsList: (page: number, limit: number) => [...syncKeys.runs(), { page, limit }] as const,
  run: (id: number) => [...syncKeys.all, 'run', id] as const,
};

export function useSyncStats() {
  const query = useQuery({
    queryKey: syncKeys.stats(),
    queryFn: () => sincronizacionService.getStats(),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 120,
    refetchOnWindowFocus: false,
  });

  return {
    stats: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
