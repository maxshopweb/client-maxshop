"use client";
//! Hook solo de lectura

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ventasService } from '@/app/services/venta.service';
import type { IVentaFilters, IPaginatedResponse, IVenta } from '@/app/types/ventas.type';

export const ventasKeys = {
    all: ['ventas'] as const,
    lists: () => [...ventasKeys.all, 'list'] as const,
    list: (filters: IVentaFilters) => [...ventasKeys.lists(), filters] as const,
    details: () => [...ventasKeys.all, 'detail'] as const,
    detail: (id: number) => [...ventasKeys.details(), id] as const,
    byCliente: (idCliente: string, filters?: IVentaFilters) => [...ventasKeys.all, 'cliente', idCliente, filters] as const,
    byUsuario: (idUsuario: string, filters?: IVentaFilters) => [...ventasKeys.all, 'usuario', idUsuario, filters] as const,
};

interface UseVentasOptions {
    filters?: IVentaFilters;
    enabled?: boolean;
    keepPreviousData?: boolean;
}

export function useVentas(options: UseVentasOptions = {}) {
    const {
        filters = {},
        enabled = true,
        keepPreviousData = true,
    } = options;

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ventasKeys.list(filters),
        queryFn: () => ventasService.getAll(filters),
        enabled,
        placeholderData: keepPreviousData ? (previousData) => previousData : undefined,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
    });

    // Helper para invalidar y refetch
    const refetch = () => {
        return queryClient.invalidateQueries({
            queryKey: ventasKeys.lists(),
        });
    };

    // Helper para prefetch de la siguiente página
    const prefetchNextPage = () => {
        const nextPage = (filters.page || 1) + 1;

        if (query.data && nextPage <= query.data.totalPages) {
            queryClient.prefetchQuery({
                queryKey: ventasKeys.list({ ...filters, page: nextPage }),
                queryFn: () => ventasService.getAll({ ...filters, page: nextPage }),
                staleTime: 1000 * 60 * 5,
            });
        }
    };

    return {
        // Data
        ventas: query.data?.data || [],
        pagination: query.data ? {
            total: query.data.total,
            page: query.data.page,
            limit: query.data.limit,
            totalPages: query.data.totalPages,
            hasNextPage: query.data.page < query.data.totalPages,
            hasPrevPage: query.data.page > 1,
        } : null,

        // Estados
        isLoading: query.isLoading,
        isError: query.isError,
        isFetching: query.isFetching,
        isSuccess: query.isSuccess,

        // Error
        error: query.error,

        // Métodos
        refetch,
        prefetchNextPage,
    };
}

interface UseVentaOptions {
    id: number;
    enabled?: boolean;
}

export function useVenta({ id, enabled = true }: UseVentaOptions) {
    const query = useQuery({
        queryKey: ventasKeys.detail(id),
        queryFn: () => ventasService.getById(id),
        enabled: enabled && id > 0,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    return {
        venta: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useVentasByCliente(idCliente: string, filters: IVentaFilters = {}) {
    const query = useQuery({
        queryKey: ventasKeys.byCliente(idCliente, filters),
        queryFn: () => ventasService.getByCliente(idCliente, filters),
        enabled: !!idCliente,
        staleTime: 1000 * 60 * 5,
    });

    return {
        ventas: query.data?.data || [],
        pagination: query.data ? {
            total: query.data.total,
            page: query.data.page,
            limit: query.data.limit,
            totalPages: query.data.totalPages,
        } : null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useVentasPrefetch() {
    const queryClient = useQueryClient();

    const prefetchVenta = (id: number) => {
        queryClient.prefetchQuery({
            queryKey: ventasKeys.detail(id),
            queryFn: () => ventasService.getById(id),
            staleTime: 1000 * 60 * 5,
        });
    };

    return { prefetchVenta };
}

export function useVentasCache() {
    const queryClient = useQueryClient();

    const getVentaFromCache = (id: number): IVenta | undefined => {
        return queryClient.getQueryData(ventasKeys.detail(id));
    };

    const getVentasFromCache = (filters: IVentaFilters): IPaginatedResponse<IVenta> | undefined => {
        return queryClient.getQueryData(ventasKeys.list(filters));
    };

    return {
        getVentaFromCache,
        getVentasFromCache,
    };
}

