"use client";

import { useCallback, useMemo, useState, useEffect, useTransition, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { IProductoFilters } from "@/app/types/producto.type";
import { EstadoGeneral } from "@/app/types/estados.type";
import { useCategorias, useSubcategorias } from "@/app/hooks/categorias/useCategorias";
import { useMarcas } from "@/app/hooks/marcas/useMarcas";
import { useGrupos } from "@/app/hooks/grupos/useGrupos";

// ============================================================================
// TYPES
// ============================================================================

export interface ProductFilters {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    categoria?: string;
    categoriaLabel?: string;
    marca?: string;
    marcaLabel?: string;
    grupo?: string;
    grupoLabel?: string;
    destacado?: boolean;
    oferta?: boolean;
    // Filtros adicionales del admin
    estado?: EstadoGeneral; // Solo para admin ver activos/inactivos (1 o 2, nunca 0)
    activo?: string; // Filtro por publicar/despublicar: "A" = publicado, "I" = despublicado
    stockBajo?: boolean;
    financiacion?: boolean;
    subcategoria?: number;
}

export interface SortOption {
    field: string;
    order: "asc" | "desc";
}

export interface UseProductFiltersReturn {
    filters: ProductFilters & IProductoFilters; // Compatible con ambos formatos
    sort: SortOption | null;
    backendFilters: IProductoFilters;
    page: number;
    limit: number;
    setSearch: (value: string) => void;
    setPriceRange: (min: number | undefined, max: number | undefined) => void;
    setCategoria: (value: string | undefined) => void;
    setMarca: (value: string | undefined) => void;
    setGrupo: (value: string | undefined) => void;
    setDestacado: (value: boolean) => void;
    setOferta: (value: boolean) => void;
    setSort: (field: string, order?: "asc" | "desc") => void;
    clearFilters: () => void;
    hasActiveFilters: boolean;
    localSearch: string;
    localPriceRange: [number | undefined, number | undefined];
    // Funciones adicionales del admin
    setFilter: <K extends keyof IProductoFilters>(key: K, value: IProductoFilters[K]) => void;
    nextPage: () => void;
    prevPage: () => void;
    goToPage: (page: number) => void;
    activeFiltersCount: number;
    // Datos del backend
    categorias: any[];
    subcategorias: any[];
    marcas: any[];
    grupos: any[];
    loadingCategorias: boolean;
    loadingSubcategorias: boolean;
    loadingMarcas: boolean;
    loadingGrupos: boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

function parseNumber(value: string | null): number | undefined {
    if (!value) return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
}

function parseBoolean(value: string | null): boolean | undefined {
    if (!value) return undefined;
    return value === "true";
}

// ============================================================================
// HOOK
// ============================================================================

export function useProductFilters(): UseProductFiltersReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();

    // Estado local solo para inputs con debounce
    const initialSearch = searchParams.get("search") || "";
    const [localSearch, setLocalSearch] = useState(() => initialSearch);
    const [localPriceRange, setLocalPriceRange] = useState<[number | undefined, number | undefined]>(() => [
        parseNumber(searchParams.get("minPrice")),
        parseNumber(searchParams.get("maxPrice")),
    ]);

    // Ref para evitar loop en debounce de search
    const lastSearchUpdateRef = useRef<string>(initialSearch.trim());
    const lastPriceUpdateRef = useRef<string>("");
    const lastUrlSearchRef = useRef<string>(initialSearch.trim());

    // Obtener datos del backend
    const { data: categoriasResponse, isLoading: loadingCategorias } = useCategorias();
    const { data: marcasResponse, isLoading: loadingMarcas } = useMarcas();
    const { data: gruposResponse, isLoading: loadingGrupos } = useGrupos();

    // Obtener subcategorías según la categoría seleccionada
    const categoriaFromUrl = searchParams.get("categoria");
    const categoriaId = categoriaFromUrl ? (isNaN(Number(categoriaFromUrl)) ? undefined : Number(categoriaFromUrl)) : undefined;
    const { data: subcategoriasResponse, isLoading: loadingSubcategorias } = useSubcategorias(categoriaId);

    // Extraer los arrays de data
    const categorias = categoriasResponse?.data || [];
    const subcategorias = subcategoriasResponse?.data || [];
    const marcas = marcasResponse?.data || [];
    const grupos = gruposResponse?.data || [];

    const paramsRef = useRef<URLSearchParams>(
        new URLSearchParams(searchParams.toString())
    );

    useEffect(() => {
        paramsRef.current = new URLSearchParams(searchParams.toString());
    }, [searchParams]);


    // Función única para actualizar URL - SIN searchParams en deps
    const updateURL = useCallback(
        (updates: Record<string, string | number | boolean | undefined | null>) => {
            startTransition(() => {
                const params = new URLSearchParams(paramsRef.current.toString());

                Object.entries(updates).forEach(([key, value]) => {
                    if (value === undefined || value === null || value === "") {
                        params.delete(key);
                    } else {
                        params.set(key, String(value));
                    }
                });

                paramsRef.current = new URLSearchParams(params.toString());

                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [pathname, router]
    );


    // Sincronizar localSearch con URL cuando cambia desde fuera (navegación)
    useEffect(() => {
        const urlSearch = searchParams.get("search") || "";
        const trimmedUrlSearch = urlSearch.trim();
        // Solo actualizar si la URL cambió desde fuera (no viene del debounce del usuario)
        if (trimmedUrlSearch !== lastUrlSearchRef.current) {
            lastUrlSearchRef.current = trimmedUrlSearch;
            // Solo actualizar localSearch si es diferente al valor actual
            setLocalSearch((prev) => {
                if (prev.trim() !== trimmedUrlSearch) {
                    lastSearchUpdateRef.current = trimmedUrlSearch;
                    return urlSearch;
                }
                return prev;
            });
        }
    }, [searchParams]);

    // Debounce para search
    useEffect(() => {
        const trimmed = localSearch.trim();

        // Evitar loop: solo actualizar si cambió de verdad
        if (trimmed === lastSearchUpdateRef.current) return;

        const timer = setTimeout(() => {
            lastSearchUpdateRef.current = trimmed;
            updateURL({ search: trimmed || undefined, page: 1 });
        }, 300);

        return () => clearTimeout(timer);
    }, [localSearch, updateURL]);

    // Debounce para price range
    useEffect(() => {
        const [min, max] = localPriceRange;
        const key = `${min}-${max}`;

        // Evitar loop: solo actualizar si cambió de verdad
        if (key === lastPriceUpdateRef.current) return;

        const timer = setTimeout(() => {
            lastPriceUpdateRef.current = key;
            updateURL({ minPrice: min, maxPrice: max, page: 1 });
        }, 300);

        return () => clearTimeout(timer);
    }, [localPriceRange, updateURL]);

    // Parse filters from URL (source of truth)
    const filters = useMemo<ProductFilters>(
        () => {
            const marcaParam = searchParams.get("marca");
            return {
                search: searchParams.get("search") || undefined,
                minPrice: parseNumber(searchParams.get("minPrice")),
                maxPrice: parseNumber(searchParams.get("maxPrice")),
                categoria: searchParams.get("categoria") || undefined,
                marca: marcaParam && marcaParam.trim() !== '' ? marcaParam : undefined,
                grupo: searchParams.get("grupo") || undefined,
                destacado: parseBoolean(searchParams.get("destacado")),
                oferta: parseBoolean(searchParams.get("oferta")),
                // Filtros adicionales del admin
                estado: searchParams.get("estado") !== null ? (parseNumber(searchParams.get("estado")) as EstadoGeneral) : undefined,
                activo: searchParams.get("activo") || undefined, // "A" = publicado, "I" = despublicado
                stockBajo: parseBoolean(searchParams.get("stockBajo")),
                financiacion: parseBoolean(searchParams.get("financiacion")),
                subcategoria: parseNumber(searchParams.get("subcategoria")),
            };
        },
        [searchParams]
    );

    const sort = useMemo<SortOption | null>(() => {
        const orderBy = searchParams.get("order_by");
        const order = searchParams.get("order") as "asc" | "desc" | null;
        if (!orderBy || !order) return null;
        return { field: orderBy, order };
    }, [searchParams]);

    const page = parseNumber(searchParams.get("page")) || 1;
    // Limitar el máximo de productos a 100 para evitar requests masivos
    const maxLimit = 100;
    const requestedLimit = parseNumber(searchParams.get("limit")) || 21;
    const limit = requestedLimit > maxLimit ? maxLimit : requestedLimit;

    // Handlers
    const setSearch = useCallback((value: string) => setLocalSearch(value), []);

    const setPriceRange = useCallback(
        (min: number | undefined, max: number | undefined) => setLocalPriceRange([min, max]),
        []
    );

    const setCategoria = useCallback(
        (value: string | undefined) => updateURL({ categoria: value, page: 1 }),
        [updateURL]
    );

    const setMarca = useCallback(
        (value: string | undefined) => updateURL({ marca: value, page: 1 }),
        [updateURL]
    );

    const setGrupo = useCallback(
        (value: string | undefined) => updateURL({ grupo: value, page: 1 }),
        [updateURL]
    );

    const setDestacado = useCallback(
        (value: boolean) => updateURL({ destacado: value || undefined, page: 1 }),
        [updateURL]
    );

    const setOferta = useCallback(
        (value: boolean) => updateURL({ oferta: value || undefined, page: 1 }),
        [updateURL]
    );

    const setSort = useCallback(
        (field: string, order: "asc" | "desc" = "asc") => {
            startTransition(() => {
                // Leer directamente de window.location para asegurar que tenemos TODOS los params actuales
                const currentURL = new URL(window.location.href);
                const params = new URLSearchParams(currentURL.search);

                // SOLO actualizar order_by, order y page - NO tocar otros filtros
                params.set("order_by", field);
                params.set("order", order);
                params.set("page", "1"); // Resetear página al cambiar ordenamiento

                // Actualizar el ref para mantener sincronización
                paramsRef.current = new URLSearchParams(params.toString());

                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            });
        },
        [pathname, router]
    );

    // Función genérica setFilter para el admin (acepta cualquier filtro de IProductoFilters)
    const setFilter = useCallback(
        <K extends keyof IProductoFilters>(key: K, value: IProductoFilters[K]) => {
            // Mapeo de filtros de IProductoFilters a nombres de URL
            const urlKeyMap: Record<string, string> = {
                busqueda: "search",
                precio_min: "minPrice",
                precio_max: "maxPrice",
                id_cat: "categoria",
                id_marca: "marca",
                codi_grupo: "grupo",
                id_subcat: "subcategoria",
                estado: "estado",
                activo: "activo", // "A" = publicado, "I" = despublicado
                destacado: "destacado",
                financiacion: "financiacion",
                stock_bajo: "stockBajo",
                page: "page",
                limit: "limit",
                order_by: "order_by",
                order: "order",
            };

            const urlKey = urlKeyMap[key] || key;

            // Si es búsqueda, actualizar estado local (el debounce actualizará URL)
            if (key === "busqueda") {
                setLocalSearch(value as string || "");
                return;
            }

            // Si es precio, actualizar estado local (el debounce actualizará URL)
            if (key === "precio_min" || key === "precio_max") {
                const [min, max] = localPriceRange;
                if (key === "precio_min") {
                    setLocalPriceRange([value as number | undefined, max]);
                } else {
                    setLocalPriceRange([min, value as number | undefined]);
                }
                return;
            }

            // Para otros filtros, actualizar URL directamente
            const updates: Record<string, string | number | boolean | undefined | null> = {
                [urlKey]: value,
            };

            // Resetear página solo si cambia un filtro (no para page/limit/order_by/order)
            if (key !== "page" && key !== "limit" && key !== "order_by" && key !== "order") {
                updates.page = 1;
            }

            updateURL(updates);
        },
        [updateURL, localPriceRange]
    );

    // Funciones de paginación
    const nextPage = useCallback(() => {
        setFilter("page", (page || 1) + 1 as any);
    }, [page, setFilter]);

    const prevPage = useCallback(() => {
        if ((page || 1) > 1) {
            setFilter("page", (page || 1) - 1 as any);
        }
    }, [page, setFilter]);

    const goToPage = useCallback(
        (pageNum: number) => {
            setFilter("page", pageNum as any);
        },
        [setFilter]
    );

    const clearFilters = useCallback(() => {
        const orderBy = searchParams.get("order_by");
        const order = searchParams.get("order");

        // Limpiar estados locales
        setLocalSearch("");
        setLocalPriceRange([undefined, undefined]);
        
        // Actualizar refs para evitar problemas de sincronización
        lastSearchUpdateRef.current = "";
        lastPriceUpdateRef.current = "";
        lastUrlSearchRef.current = "";

        startTransition(() => {
            const params = new URLSearchParams();
            params.set("page", "1");
            params.set("limit", "21");
            if (orderBy && order) {
                params.set("order_by", orderBy);
                params.set("order", order);
            }
            paramsRef.current = new URLSearchParams(params.toString());
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }, [searchParams, pathname, router]);

    // Backend filters
    const backendFilters = useMemo<IProductoFilters>(() => {
        const backend: IProductoFilters = { page, limit };

        // Determinar si es admin o usuario (tienda)
        const isAdmin = pathname?.includes('/admin');
        
        // Para usuarios (tienda), solo mostrar productos publicados por defecto
        if (!isAdmin && !filters.activo) {
            backend.activo = "A"; // "A" = publicado
        }

        if (filters.search) backend.busqueda = filters.search;
        if (filters.minPrice !== undefined) backend.precio_min = filters.minPrice;
        if (filters.maxPrice !== undefined) backend.precio_max = filters.maxPrice;
        if (filters.categoria) backend.id_cat = filters.categoria;
        // Asegurar que marca se pase correctamente (puede ser string o number)
        if (filters.marca !== undefined && filters.marca !== null && filters.marca !== '') {
            backend.id_marca = filters.marca;
        }
        if (filters.grupo) backend.codi_grupo = filters.grupo;
        if (filters.destacado !== undefined) backend.destacado = filters.destacado;
        // Filtros adicionales del admin
        if (filters.estado !== undefined) backend.estado = filters.estado;
        if (filters.activo) backend.activo = filters.activo; // "A" = publicado, "I" = despublicado
        if (filters.stockBajo !== undefined) backend.stock_bajo = filters.stockBajo;
        if (filters.financiacion !== undefined) backend.financiacion = filters.financiacion;
        if (filters.subcategoria !== undefined) backend.id_subcat = filters.subcategoria;

        if (sort) {
            backend.order_by = sort.field as IProductoFilters["order_by"];
            backend.order = sort.order;
        } else {
            backend.order_by = "creado_en";
            backend.order = "desc";
        }

        return backend;
    }, [filters, sort, page, limit, pathname]);

    const hasActiveFilters = useMemo(
        () =>
            !!filters.search ||
            filters.minPrice !== undefined ||
            filters.maxPrice !== undefined ||
            !!filters.categoria ||
            !!filters.marca ||
            !!filters.grupo ||
            filters.destacado === true ||
            filters.oferta === true ||
            !!filters.activo ||
            filters.stockBajo === true ||
            filters.financiacion === true ||
            filters.subcategoria !== undefined,
        [filters]
    );

    // Contar filtros activos
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
        if (filters.categoria) count++;
        if (filters.subcategoria !== undefined) count++;
        if (filters.marca) count++;
        if (filters.grupo) count++;
        if (filters.destacado === true) count++;
        if (filters.oferta === true) count++;
        if (filters.activo) count++;
        if (filters.stockBajo === true) count++;
        if (filters.financiacion === true) count++;
        return count;
    }, [filters]);

    // Filtros combinados (compatible con ambos formatos: tienda y admin)
    const filtersCombined = useMemo<ProductFilters & IProductoFilters>(() => {
        // Leer directamente de searchParams para soportar ambos formatos de URL (prioridad: URL > filters > backendFilters)
        const categoriaFromUrl = searchParams.get("categoria") || searchParams.get("id_cat") || null;
        const marcaFromUrl = searchParams.get("marca") || searchParams.get("id_marca") || null;
        const grupoFromUrl = searchParams.get("grupo") || searchParams.get("codi_grupo") || null;
        const searchFromUrl = searchParams.get("search") || searchParams.get("busqueda") || null;
        const subcategoriaFromUrl = searchParams.get("subcategoria") || searchParams.get("id_subcat") || null;
        const estadoFromUrl = searchParams.get("estado");
        const activoFromUrl = searchParams.get("activo");
        const destacadoFromUrl = searchParams.get("destacado");
        const financiacionFromUrl = searchParams.get("financiacion");
        const stockBajoFromUrl = searchParams.get("stockBajo") || searchParams.get("stock_bajo") || null;

        return {
            ...filters, // Nombres en inglés (para la tienda)
            ...backendFilters, // Nombres en español (para el admin)
            // Mapeo bidireccional para compatibilidad completa
            // Prioridad: URL > filters > backendFilters
            busqueda: searchFromUrl || filters.search || backendFilters.busqueda || undefined,
            precio_min: filters.minPrice ?? backendFilters.precio_min ?? parseNumber(searchParams.get("precio_min")) ?? undefined,
            precio_max: filters.maxPrice ?? backendFilters.precio_max ?? parseNumber(searchParams.get("precio_max")) ?? undefined,
            id_cat: categoriaFromUrl || filters.categoria || backendFilters.id_cat || undefined,
            id_marca: marcaFromUrl || filters.marca || backendFilters.id_marca || undefined,
            codi_grupo: grupoFromUrl || filters.grupo || backendFilters.codi_grupo || undefined,
            id_subcat: subcategoriaFromUrl ? parseNumber(subcategoriaFromUrl) : (filters.subcategoria ?? backendFilters.id_subcat ?? undefined),
            stock_bajo: stockBajoFromUrl ? parseBoolean(stockBajoFromUrl) : (filters.stockBajo ?? backendFilters.stock_bajo ?? undefined),
            estado: estadoFromUrl !== null ? (parseNumber(estadoFromUrl) as EstadoGeneral) : (filters.estado ?? backendFilters.estado ?? undefined),
            activo: activoFromUrl || filters.activo || backendFilters.activo || undefined,
            financiacion: financiacionFromUrl !== null ? parseBoolean(financiacionFromUrl) : (filters.financiacion ?? backendFilters.financiacion ?? undefined),
            destacado: destacadoFromUrl !== null ? parseBoolean(destacadoFromUrl) : (filters.destacado ?? backendFilters.destacado ?? undefined),
        } as ProductFilters & IProductoFilters;
    }, [filters, backendFilters, searchParams]);

    return {
        filters: filtersCombined,
        sort,
        backendFilters,
        page,
        limit,
        setSearch,
        setPriceRange,
        setCategoria,
        setMarca,
        setGrupo,
        setDestacado,
        setOferta,
        setSort,
        clearFilters,
        hasActiveFilters,
        localSearch,
        localPriceRange,
        // Funciones adicionales del admin
        setFilter,
        nextPage,
        prevPage,
        goToPage,
        activeFiltersCount,
        // Datos del backend
        categorias,
        subcategorias,
        marcas,
        grupos,
        loadingCategorias,
        loadingSubcategorias,
        loadingMarcas,
        loadingGrupos,
    };
}