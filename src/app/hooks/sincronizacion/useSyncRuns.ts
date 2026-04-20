"use client";

import { useQuery } from '@tanstack/react-query';
import { sincronizacionService } from '@/app/services/sincronizacion.service';
import { syncKeys } from './useSyncStats';

interface UseSyncRunsOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useSyncRuns({ page = 1, limit = 50, enabled = true }: UseSyncRunsOptions = {}) {
  const query = useQuery({
    queryKey: syncKeys.runsList(page, limit),
    queryFn: () => sincronizacionService.getRuns(page, limit),
    enabled,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 120,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  });

  return {
    runs: query.data?.data ?? [],
    pagination: query.data?.pagination ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
  };
}
