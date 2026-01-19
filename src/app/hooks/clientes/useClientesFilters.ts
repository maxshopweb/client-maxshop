import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { IClienteFilters } from '@/app/types/cliente.type';
import { EstadoGeneral } from '@/app/types/estados.type';

const DEFAULT_FILTERS: IClienteFilters = {
    page: 1,
    limit: 25,
    order_by: 'creado_en',
    order: 'desc',
};

export function useClientesFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Estado local para búsqueda (sin actualizar URL)
    const [localBusqueda, setLocalBusqueda] = useState('');

    // Debounce solo para la búsqueda
    const debouncedBusqueda = useDebounce(localBusqueda, 500);

    const filters = useMemo<IClienteFilters>(() => {
        const params: IClienteFilters = { ...DEFAULT_FILTERS };

        const page = searchParams.get('page');
        if (page) params.page = Number(page);

        const limit = searchParams.get('limit');
        if (limit) params.limit = Number(limit);

        const orderBy = searchParams.get('order_by');
        if (orderBy) params.order_by = orderBy as IClienteFilters['order_by'];

        const order = searchParams.get('order');
        if (order) params.order = order as 'asc' | 'desc';

        // Usar búsqueda debounced
        const busqueda = searchParams.get('busqueda');
        if (busqueda) params.busqueda = busqueda;

        const estado = searchParams.get('estado');
        if (estado !== null) params.estado = Number(estado) as EstadoGeneral;

        const ciudad = searchParams.get('ciudad');
        if (ciudad) params.ciudad = ciudad;

        const provincia = searchParams.get('provincia');
        if (provincia) params.provincia = provincia;

        const creadoDesde = searchParams.get('creado_desde');
        if (creadoDesde) params.creado_desde = creadoDesde;

        const creadoHasta = searchParams.get('creado_hasta');
        if (creadoHasta) params.creado_hasta = creadoHasta;

        const ultimoLoginDesde = searchParams.get('ultimo_login_desde');
        if (ultimoLoginDesde) params.ultimo_login_desde = ultimoLoginDesde;

        const ultimoLoginHasta = searchParams.get('ultimo_login_hasta');
        if (ultimoLoginHasta) params.ultimo_login_hasta = ultimoLoginHasta;

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
        (newFilters: IClienteFilters) => {
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
        <K extends keyof IClienteFilters>(key: K, value: IClienteFilters[K]) => {
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
        (newFilters: Partial<IClienteFilters>) => {
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
        const resetedFilters: IClienteFilters = {
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
            filters.estado !== undefined ||
            !!filters.ciudad ||
            !!filters.provincia ||
            !!filters.creado_desde ||
            !!filters.creado_hasta ||
            !!filters.ultimo_login_desde ||
            !!filters.ultimo_login_hasta
        );
    }, [localBusqueda, filters]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (localBusqueda) count++;
        if (filters.estado !== undefined) count++;
        if (filters.ciudad) count++;
        if (filters.provincia) count++;
        if (filters.creado_desde || filters.creado_hasta) count++;
        if (filters.ultimo_login_desde || filters.ultimo_login_hasta) count++;
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
        (orderBy: IClienteFilters['order_by']) => {
            if (filters.order_by === orderBy) {
                setFilter('order', filters.order === 'asc' ? 'desc' : 'asc');
            } else {
                setFilters({ order_by: orderBy, order: 'desc' });
            }
        },
        [filters.order_by, filters.order, setFilter, setFilters]
    );

    // Construir filtros finales: solo incluir busqueda si tiene valor
    const finalFilters = useMemo(() => {
        const result = { ...filters };
        // Solo incluir busqueda si tiene valor (no string vacío)
        if (localBusqueda && localBusqueda.trim()) {
            result.busqueda = localBusqueda;
        } else {
            // Si no hay búsqueda, asegurarse de que no esté en los filtros
            delete result.busqueda;
        }
        return result;
    }, [filters, localBusqueda]);

    return {
        filters: finalFilters,
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
        // También retornar localBusqueda para el input
        localBusqueda,
    };
}

