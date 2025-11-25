import { useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { IProductoFilters } from '@/app/types/producto.type';
import { EstadoGeneral } from '@/app/types/estados.type';
import { useCategorias, useSubcategorias } from '@/app/hooks/categorias/useCategorias';
import { useMarcas } from '@/app/hooks/marcas/useMarcas';
import { useGrupos } from '@/app/hooks/grupos/useGrupos';

const DEFAULT_FILTERS: IProductoFilters = {
    page: 1,
    limit: 25,
    order_by: 'creado_en',
    order: 'desc',
};

export function useProductosFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Estado local para búsqueda (sin actualizar URL)
    const [localBusqueda, setLocalBusqueda] = useState('');

    // Debounce solo para la búsqueda
    const debouncedBusqueda = useDebounce(localBusqueda, 500);

    // Obtener datos del backend
    const { data: categoriasResponse, isLoading: loadingCategorias } = useCategorias();
    const { data: marcasResponse, isLoading: loadingMarcas } = useMarcas();
    const { data: gruposResponse, isLoading: loadingGrupos } = useGrupos();

    // Obtener subcategorías según la categoría seleccionada
    const idCatFromUrl = searchParams.get('id_cat');
    const { data: subcategoriasResponse, isLoading: loadingSubcategorias } = useSubcategorias(
        idCatFromUrl ? Number(idCatFromUrl) : undefined
    );

    // Extraer los arrays de data
    const categorias = categoriasResponse?.data || [];
    const subcategorias = subcategoriasResponse?.data || [];
    const marcas = marcasResponse?.data || [];
    const grupos = gruposResponse?.data || [];

    const filters = useMemo<IProductoFilters>(() => {
        const params: IProductoFilters = { ...DEFAULT_FILTERS };

        const page = searchParams.get('page');
        if (page) params.page = Number(page);

        const limit = searchParams.get('limit');
        if (limit) params.limit = Number(limit);

        const orderBy = searchParams.get('order_by');
        if (orderBy) params.order_by = orderBy as IProductoFilters['order_by'];

        const order = searchParams.get('order');
        if (order) params.order = order as 'asc' | 'desc';

        // Usar búsqueda debounced
        const busqueda = searchParams.get('busqueda');
        if (busqueda) params.busqueda = busqueda;

        const estado = searchParams.get('estado');
        if (estado !== null) params.estado = Number(estado) as EstadoGeneral;

        const idCat = searchParams.get('id_cat');
        if (idCat) params.id_cat = Number(idCat);

        const idSubcat = searchParams.get('id_subcat');
        if (idSubcat) params.id_subcat = Number(idSubcat);

        const idMarca = searchParams.get('id_marca');
        if (idMarca) params.id_marca = Number(idMarca);

        const codiGrupo = searchParams.get('codi_grupo');
        if (codiGrupo) params.codi_grupo = codiGrupo;

        const precioMin = searchParams.get('precio_min');
        if (precioMin) params.precio_min = Number(precioMin);

        const precioMax = searchParams.get('precio_max');
        if (precioMax) params.precio_max = Number(precioMax);

        const destacado = searchParams.get('destacado');
        if (destacado !== null) params.destacado = destacado === 'true';

        const financiacion = searchParams.get('financiacion');
        if (financiacion !== null) params.financiacion = financiacion === 'true';

        const stockBajo = searchParams.get('stock_bajo');
        if (stockBajo !== null) params.stock_bajo = stockBajo === 'true';

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
        (newFilters: IProductoFilters) => {
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
        <K extends keyof IProductoFilters>(key: K, value: IProductoFilters[K]) => {
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

    // Resto del código igual...
    const setFilters = useCallback(
        (newFilters: Partial<IProductoFilters>) => {
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
        const resetedFilters: IProductoFilters = {
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
            !!filters.id_cat ||
            !!filters.id_subcat ||
            !!filters.id_marca ||
            filters.precio_min !== undefined ||
            filters.precio_max !== undefined ||
            filters.destacado !== undefined ||
            filters.financiacion !== undefined ||
            filters.stock_bajo !== undefined
        );
    }, [localBusqueda, filters]);

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (localBusqueda) count++;
        if (filters.estado !== undefined) count++;
        if (filters.id_cat) count++;
        if (filters.id_subcat) count++;
        if (filters.id_marca) count++;
        if (filters.precio_min !== undefined || filters.precio_max !== undefined) count++;
        if (filters.destacado !== undefined) count++;
        if (filters.financiacion !== undefined) count++;
        if (filters.stock_bajo !== undefined) count++;
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
        (orderBy: IProductoFilters['order_by']) => {
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
        // Datos del backend
        categorias,
        subcategorias,
        marcas,
        grupos,
        // Estados de carga
        loadingCategorias,
        loadingSubcategorias,
        loadingMarcas,
        loadingGrupos,
    };
}