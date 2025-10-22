"use client";
//! Hook solo de lectura

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productosService } from '@/app/services/producto.service';
import type { IProductoFilters, IPaginatedResponse, IProductos } from '@/app/types/producto.type';

export const productosKeys = {
    all: ['productos'] as const,
    lists: () => [...productosKeys.all, 'list'] as const,
    list: (filters: IProductoFilters) => [...productosKeys.lists(), filters] as const,
    details: () => [...productosKeys.all, 'detail'] as const,
    detail: (id: number) => [...productosKeys.details(), id] as const,
    destacados: (limit?: number) => [...productosKeys.all, 'destacados', limit] as const,
    stockBajo: () => [...productosKeys.all, 'stock-bajo'] as const,
};

interface UseProductosOptions {
    filters?: IProductoFilters;
    enabled?: boolean; // Para controlar cuando se ejecuta la query
    keepPreviousData?: boolean; // Para mantener datos mientras carga nuevos
}

export function useProductos(options: UseProductosOptions = {}) {
    const {
        filters = {},
        enabled = true,
        keepPreviousData = true,
    } = options;

    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: productosKeys.list(filters),
        queryFn: () => productosService.getAll(filters),
        enabled,
        placeholderData: keepPreviousData ? (previousData) => previousData : undefined,
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
    });

    // Helper para invalidar y refetch
    const refetch = () => {
        return queryClient.invalidateQueries({
            queryKey: productosKeys.lists(),
        });
    };

    // Helper para prefetch de la siguiente página
    const prefetchNextPage = () => {
        const nextPage = (filters.page || 1) + 1;

        if (query.data && nextPage <= query.data.totalPages) {
            queryClient.prefetchQuery({
                queryKey: productosKeys.list({ ...filters, page: nextPage }),
                queryFn: () => productosService.getAll({ ...filters, page: nextPage }),
                staleTime: 1000 * 60 * 5,
            });
        }
    };

    return {
        // Data
        productos: query.data?.data || [],
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

interface UseProductoOptions {
    id: number;
    enabled?: boolean;
}

export function useProducto({ id, enabled = true }: UseProductoOptions) {
    const query = useQuery({
        queryKey: productosKeys.detail(id),
        queryFn: () => productosService.getById(id),
        enabled: enabled && id > 0,
        staleTime: 1000 * 60 * 5,
        retry: 1, // Solo reintenta 1 vez si falla
    });

    return {
        producto: query.data || null,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

interface UseProductosDestacadosOptions {
    limit?: number;
    enabled?: boolean;
}

export function useProductosDestacados(options: UseProductosDestacadosOptions = {}) {
    const { limit = 10, enabled = true } = options;

    const query = useQuery({
        queryKey: productosKeys.destacados(limit),
        queryFn: () => productosService.getDestacados(limit),
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutos (cambian menos)
    });

    return {
        productos: query.data || [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useProductosStockBajo(enabled: boolean = true) {
    const query = useQuery({
        queryKey: productosKeys.stockBajo(),
        queryFn: () => productosService.getStockBajo(),
        enabled,
        staleTime: 1000 * 60 * 2, // 2 minutos (info crítica)
        refetchInterval: 1000 * 60 * 5, // Refetch cada 5 minutos
    });

    return {
        productos: query.data || [],
        count: query.data?.length || 0,
        hasStockBajo: (query.data?.length || 0) > 0,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
}

export function useProductosPrefetch() {
    const queryClient = useQueryClient();

    const prefetchProducto = (id: number) => {
        queryClient.prefetchQuery({
            queryKey: productosKeys.detail(id),
            queryFn: () => productosService.getById(id),
            staleTime: 1000 * 60 * 5,
        });
    };

    return { prefetchProducto };
}

export function useProductosCache() {
    const queryClient = useQueryClient();

    const getProductoFromCache = (id: number): IProductos | undefined => {
        return queryClient.getQueryData(productosKeys.detail(id));
    };

    const getProductosFromCache = (filters: IProductoFilters): IPaginatedResponse<IProductos> | undefined => {
        return queryClient.getQueryData(productosKeys.list(filters));
    };

    return {
        getProductoFromCache,
        getProductosFromCache,
    };
}