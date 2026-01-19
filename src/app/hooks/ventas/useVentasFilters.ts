import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { IVentaFilters } from '@/app/types/ventas.type';
import { EstadoPago, EstadoEnvio, MetodoPago, TipoVenta } from '@/app/types/estados.type';

const DEFAULT_FILTERS: IVentaFilters = {
    page: 1,
    limit: 25,
    order_by: 'fecha',
    order: 'desc',
};

export function useVentasFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Estado local para búsqueda (sin actualizar URL)
    const [localBusqueda, setLocalBusqueda] = useState('');

    // Debounce solo para la búsqueda
    const debouncedBusqueda = useDebounce(localBusqueda, 500);

    const filters = useMemo<IVentaFilters>(() => {
        const params: IVentaFilters = { ...DEFAULT_FILTERS };

        const page = searchParams.get('page');
        if (page) params.page = Number(page);

        const limit = searchParams.get('limit');
        if (limit) params.limit = Number(limit);

        const orderBy = searchParams.get('order_by');
        if (orderBy) params.order_by = orderBy as IVentaFilters['order_by'];

        const order = searchParams.get('order');
        if (order) params.order = order as 'asc' | 'desc';

        // Usar búsqueda debounced
        const busqueda = searchParams.get('busqueda');
        if (busqueda) params.busqueda = busqueda;

        const idCliente = searchParams.get('id_cliente');
        if (idCliente) params.id_cliente = idCliente;

        const idUsuario = searchParams.get('id_usuario');
        if (idUsuario) params.id_usuario = idUsuario;

        const fechaDesde = searchParams.get('fecha_desde');
        if (fechaDesde) params.fecha_desde = fechaDesde;

        const fechaHasta = searchParams.get('fecha_hasta');
        if (fechaHasta) params.fecha_hasta = fechaHasta;

        const estadoPago = searchParams.get('estado_pago');
        if (estadoPago) params.estado_pago = estadoPago as EstadoPago;

        const estadoEnvio = searchParams.get('estado_envi');
        if (estadoEnvio) params.estado_envio = estadoEnvio as EstadoEnvio;

        const metodoPago = searchParams.get('metodo_pago');
        if (metodoPago) params.metodo_pago = metodoPago as MetodoPago;

        const tipoVenta = searchParams.get('tipo_venta');
        if (tipoVenta) params.tipo_venta = tipoVenta as TipoVenta;

        const totalMin = searchParams.get('total_min');
        if (totalMin) params.total_min = Number(totalMin);

        const totalMax = searchParams.get('total_max');
        if (totalMax) params.total_max = Number(totalMax);

        return params;
    }, [searchParams]);

    // Sincronizar localBusqueda con URL al montar
    useEffect(() => {
        const busqueda = searchParams.get('busqueda');
        setLocalBusqueda(busqueda || '');
    }, [searchParams]);

    // Actualizar URL solo cuando cambia el debounced
    useEffect(() => {
        if (debouncedBusqueda !== filters.busqueda) {
            const newFilters = { ...filters, busqueda: debouncedBusqueda || undefined, page: 1 };
            updateURL(newFilters);
        }
    }, [debouncedBusqueda]);

    const updateURL = useCallback(
        (newFilters: IVentaFilters) => {
            const params = new URLSearchParams();

            Object.entries(newFilters).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    params.set(key, String(value));
                }
            });

            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, router]
    );

    const setFilter = useCallback(
        <K extends keyof IVentaFilters>(key: K, value: IVentaFilters[K]) => {
            // Si es búsqueda, solo actualizar estado local
            if (key === 'busqueda') {
                setLocalBusqueda(value as string || '');
                return;
            }

            const newFilters = { ...filters, [key]: value };

            if (key !== 'page' && key !== 'limit') {
                newFilters.page = 1;
            }

            updateURL(newFilters);
        },
        [filters, updateURL]
    );

    const setFilters = useCallback(
        (newFilters: Partial<IVentaFilters>) => {
            const updatedFilters = { ...filters, ...newFilters };

            if (!newFilters.page) {
                updatedFilters.page = 1;
            }

            updateURL(updatedFilters);
        },
        [filters, updateURL]
    );

    const clearFilters = useCallback(() => {
        setLocalBusqueda('');
        updateURL(DEFAULT_FILTERS);
    }, [updateURL]);

    const resetFilters = useCallback(() => {
        setLocalBusqueda('');
        const resetedFilters: IVentaFilters = {
            page: filters.page,
            limit: filters.limit,
            order_by: filters.order_by,
            order: filters.order,
        };
        updateURL(resetedFilters);
    }, [filters.page, filters.limit, filters.order_by, filters.order, updateURL]);

    const hasActiveFilters = useMemo(() => {
        return (
            !!localBusqueda ||
            !!filters.id_cliente ||
            !!filters.id_usuario ||
            !!filters.fecha_desde ||
            !!filters.fecha_hasta ||
            !!filters.estado_pago ||
            !!filters.estado_envio ||
            !!filters.metodo_pago ||
            !!filters.tipo_venta ||
            filters.total_min !== undefined ||
            filters.total_max !== undefined
        );
    }, [localBusqueda, filters]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (localBusqueda) count++;
        if (filters.id_cliente) count++;
        if (filters.id_usuario) count++;
        if (filters.fecha_desde || filters.fecha_hasta) count++;
        if (filters.estado_pago) count++;
        if (filters.estado_envio) count++;
        if (filters.metodo_pago) count++;
        if (filters.tipo_venta) count++;
        if (filters.total_min !== undefined || filters.total_max !== undefined) count++;
        return count;
    }, [localBusqueda, filters]);

    const nextPage = useCallback(() => {
        setFilter('page', (filters.page || 1) + 1);
    }, [filters.page, setFilter]);

    const prevPage = useCallback(() => {
        if ((filters.page || 1) > 1) {
            setFilter('page', (filters.page || 1) - 1);
        }
    }, [filters.page, setFilter]);

    const goToPage = useCallback(
        (page: number) => {
            setFilter('page', page);
        },
        [setFilter]
    );

    const setSort = useCallback(
        (orderBy: IVentaFilters['order_by']) => {
            if (filters.order_by === orderBy) {
                setFilter('order', filters.order === 'asc' ? 'desc' : 'asc');
            } else {
                setFilters({ order_by: orderBy, order: 'desc' });
            }
        },
        [filters.order_by, filters.order, setFilter, setFilters]
    );

    return {
        filters: { ...filters, busqueda: localBusqueda }, // Retornar búsqueda local para el input
        setFilter,
        setFilters,
        clearFilters,
        resetFilters,
        hasActiveFilters,
        activeFiltersCount,
        nextPage,
        prevPage,
        goToPage,
        setSort,
    };
}

