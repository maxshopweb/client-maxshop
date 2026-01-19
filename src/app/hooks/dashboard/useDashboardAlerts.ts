"use client";

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/app/services/dashboard.service';
import { dashboardKeys } from './dashboardKeys';
import type { IDashboardAlerts } from '@/app/types/dashboard.type';

interface UseDashboardAlertsOptions {
  enabled?: boolean;
}

export function useDashboardAlerts(options: UseDashboardAlertsOptions = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: dashboardKeys.alerts(),
    queryFn: () => dashboardService.getAlerts(),
    enabled,
    staleTime: 1000 * 15, // 15 segundos
    gcTime: 1000 * 60, // 1 minuto
  });

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

