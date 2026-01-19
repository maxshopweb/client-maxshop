"use client";
//! Hook solo de lectura

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '@/app/services/cliente.service';
import type { IClienteFilters, IPaginatedResponse, ICliente } from '@/app/types/cliente.type';

export const clientesKeys = {
    all: ['clientes'] as const,
    lists: () => [...clientesKeys.all, 'list'] as const,
    list: (filters: IClienteFilters) => [...clientesKeys.lists(), filters] as const,
    details: () => [...clientesKeys.all, 'detail'] as const,
    detail: (id: string) => [...clientesKeys.details(), id] as const,
    stats: (id: string) => [...clientesKeys.all, 'stats', id] as const,
    ventas: (id: string, filters?: IClienteFilters) => [...clientesKeys.all, 'ventas', id, filters] as const,
};

interface UseClientesOptions {
    filters?: IClienteFilters;
    enabled?: boolean;
    keepPreviousData?: boolean;
}

export function useClientes(options: UseClientesOptions = {}) {
    const {
        filters = {},
        enabled = true,
        keepPreviousData = true,
    } = options;

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: clientesKeys.list(filters),
        queryFn: () => {
            if (process.env.NODE_ENV === 'development') {
            }
            return clientesService.getAll(filters);
        },
        enabled,
        placeholderData: keepPreviousData ? (previousData) => previousData : undefined,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
        retry: 1,
    });

    // Debug logs
    if (process.env.NODE_ENV === 'development') {
    }

    // Helper para invalidar y refetch
    const refetch = () => {
        return queryClient.invalidateQueries({
            queryKey: clientesKeys.lists(),
        });
    };

    // Helper para prefetch de la siguiente página
    const prefetchNextPage = () => {
        const nextPage = (filters.page || 1) + 1;

        if (query.data && nextPage <= query.data.totalPages) {
            queryClient.prefetchQuery({
                queryKey: clientesKeys.list({ ...filters, page: nextPage }),
                queryFn: () => clientesService.getAll({ ...filters, page: nextPage }),
                staleTime: 1000 * 60 * 5,
            });
        }
    };

    return {
        // Data
        clientes: query.data?.data || [],
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

interface UseClienteOptions {
    id: string;
    enabled?: boolean;
}

export function useCliente({ id, enabled = true }: UseClienteOptions) {
    const query = useQuery({
        queryKey: clientesKeys.detail(id),
        queryFn: () => clientesService.getById(id),
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    return {
        cliente: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useClienteStats({ id, enabled = true }: UseClienteOptions) {
    const query = useQuery({
        queryKey: clientesKeys.stats(id),
        queryFn: () => clientesService.getStats(id),
        enabled: enabled && !!id,
        staleTime: 1000 * 60 * 2, // 2 minutos
    });

    return {
        stats: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useClienteVentas(id: string, filters: IClienteFilters = {}) {
    const query = useQuery({
        queryKey: clientesKeys.ventas(id, filters),
        queryFn: () => clientesService.getVentas(id, filters),
        enabled: !!id,
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

