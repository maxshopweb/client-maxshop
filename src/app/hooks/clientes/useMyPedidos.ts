"use client";
//! Hook para obtener los pedidos del usuario autenticado

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientesService } from '@/app/services/cliente.service';
import type { IVentaFilters, IPaginatedResponse, IVenta } from '@/app/types/ventas.type';

export const myPedidosKeys = {
    all: ['mis-pedidos'] as const,
    lists: () => [...myPedidosKeys.all, 'list'] as const,
    list: (filters: IVentaFilters) => [...myPedidosKeys.lists(), filters] as const,
    details: () => [...myPedidosKeys.all, 'detail'] as const,
    detail: (id: number) => [...myPedidosKeys.details(), id] as const,
};

interface UseMyPedidosOptions {
    filters?: IVentaFilters;
    enabled?: boolean;
    keepPreviousData?: boolean;
}

export function useMyPedidos(options: UseMyPedidosOptions = {}) {
    const {
        filters = {},
        enabled = true,
        keepPreviousData = true,
    } = options;

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: myPedidosKeys.list(filters),
        queryFn: () => clientesService.getMyPedidos(filters),
        enabled,
        placeholderData: keepPreviousData ? (previousData) => previousData : undefined,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
    });

    // Helper para invalidar y refetch
    const refetch = () => {
        return queryClient.invalidateQueries({
            queryKey: myPedidosKeys.lists(),
        });
    };

    // Helper para prefetch de la siguiente página
    const prefetchNextPage = () => {
        const nextPage = (filters.page || 1) + 1;

        if (query.data && nextPage <= query.data.totalPages) {
            queryClient.prefetchQuery({
                queryKey: myPedidosKeys.list({ ...filters, page: nextPage }),
                queryFn: () => clientesService.getMyPedidos({ ...filters, page: nextPage }),
                staleTime: 1000 * 60 * 5,
            });
        }
    };

    return {
        // Data
        pedidos: query.data?.data || [],
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

