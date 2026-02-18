"use client";

import { useQuery, useQueryClient } from '@tanstack/react-query';
import AuditoriaService from '@/app/services/auditoria.service';
import type { AuditoriaLogsResponse } from '@/app/services/auditoria.service';
import type { AuditoriaFilters } from '@/app/hooks/auditoria/useAuditoriaFilters';

export const auditoriaKeys = {
    all: ['auditoria'] as const,
    lists: () => [...auditoriaKeys.all, 'list'] as const,
    list: (filters: AuditoriaFilters) => [...auditoriaKeys.lists(), filters] as const,
};

const STALE_TIME_MS = 1000 * 60 * 2;   // 2 min
const GC_TIME_MS = 1000 * 60 * 10;     // 10 min
const REFETCH_INTERVAL_MS = 1000 * 60; // 1 min revalidación automática

interface UseAuditoriaOptions {
    filters: AuditoriaFilters;
    enabled?: boolean;
    refetchInterval?: number | false;
    initialData?: AuditoriaLogsResponse;
}

function filtersToParams(f: AuditoriaFilters): Parameters<typeof AuditoriaService.getLogs>[0] {
    const { page = 1, limit = 50, ...rest } = f;
    return { page, limit, ...rest };
}

export function useAuditoria(options: UseAuditoriaOptions) {
    const {
        filters,
        enabled = true,
        refetchInterval = REFETCH_INTERVAL_MS,
        initialData,
    } = options;

    const queryClient = useQueryClient();
    const params = filtersToParams(filters);

    const query = useQuery({
        queryKey: auditoriaKeys.list(filters),
        queryFn: () => AuditoriaService.getLogs(params),
        enabled,
        staleTime: STALE_TIME_MS,
        gcTime: GC_TIME_MS,
        refetchInterval,
        refetchOnWindowFocus: true,
        retry: 1,
        ...(initialData && {
            initialData,
            initialDataUpdatedAt: Date.now(),
        }),
        placeholderData: (previousData) => previousData,
    });

    const pagination = query.data?.pagination;
    const refetch = () =>
        queryClient.invalidateQueries({ queryKey: auditoriaKeys.lists() });

    const prefetchNextPage = () => {
        if (pagination && filters.page < pagination.totalPages) {
            const nextFilters = { ...filters, page: filters.page + 1 };
            queryClient.prefetchQuery({
                queryKey: auditoriaKeys.list(nextFilters),
                queryFn: () => AuditoriaService.getLogs(filtersToParams(nextFilters)),
                staleTime: STALE_TIME_MS,
            });
        }
    };

    return {
        logs: query.data?.data ?? [],
        pagination: pagination
            ? {
                total: pagination.total,
                page: pagination.page,
                limit: pagination.limit,
                totalPages: pagination.totalPages,
                hasNextPage: pagination.page < pagination.totalPages,
                hasPrevPage: pagination.page > 1,
            }
            : null,
        isLoading: query.isLoading,
        isError: query.isError,
        isFetching: query.isFetching,
        isSuccess: query.isSuccess,
        error: query.error,
        refetch,
        prefetchNextPage,
    };
}
