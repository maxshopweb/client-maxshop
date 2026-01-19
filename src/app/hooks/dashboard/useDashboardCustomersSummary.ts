"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from './dashboardKeys';
import type { ICustomersSummary, IDashboardDateRange } from '@/app/types/dashboard.type';

interface UseDashboardCustomersSummaryOptions {
  dateRange?: IDashboardDateRange;
  enabled?: boolean;
}

export function useDashboardCustomersSummary(options: UseDashboardCustomersSummaryOptions = {}) {
  const { dateRange = {}, enabled = true } = options;

  const query = useQuery({
    queryKey: dashboardKeys.customersSummary(dateRange),
    queryFn: () => dashboardService.getCustomersSummary(dateRange),
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

