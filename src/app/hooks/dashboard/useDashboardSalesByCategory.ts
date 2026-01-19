"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from './dashboardKeys';
import type { ISalesByCategoryItem, IDashboardDateRange } from '@/app/types/dashboard.type';

interface UseDashboardSalesByCategoryOptions {
  dateRange?: IDashboardDateRange;
  enabled?: boolean;
}

export function useDashboardSalesByCategory(options: UseDashboardSalesByCategoryOptions = {}) {
  const { dateRange = {}, enabled = true } = options;

  const query = useQuery({
    queryKey: dashboardKeys.salesByCategory(dateRange),
    queryFn: () => dashboardService.getSalesByCategory(dateRange),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

