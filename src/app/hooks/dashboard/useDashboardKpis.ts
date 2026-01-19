"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from './dashboardKeys';
import type { IDashboardKpis, IDashboardDateRange } from '@/app/types/dashboard.type';

interface UseDashboardKpisOptions {
  dateRange?: IDashboardDateRange;
  enabled?: boolean;
}

export function useDashboardKpis(options: UseDashboardKpisOptions = {}) {
  const { dateRange = {}, enabled = true } = options;

  const query = useQuery({
    queryKey: dashboardKeys.kpis(dateRange),
    queryFn: () => dashboardService.getKpis(dateRange),
    enabled,
    staleTime: 1000 * 30, // 30 segundos
    gcTime: 1000 * 60 * 2, // 2 minutos
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

