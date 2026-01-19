"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from './dashboardKeys';
import type { ITopProduct, ITopProductsParams } from '@/app/types/dashboard.type';

interface UseDashboardTopProductsOptions {
  params?: ITopProductsParams;
  enabled?: boolean;
}

export function useDashboardTopProducts(options: UseDashboardTopProductsOptions = {}) {
  const { params = {}, enabled = true } = options;

  const query = useQuery({
    queryKey: dashboardKeys.topProducts(params),
    queryFn: () => dashboardService.getTopProducts(params),
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

