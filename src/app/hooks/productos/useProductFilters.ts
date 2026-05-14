"use client";

import { useCallback, useMemo, useState, useEffect, useLayoutEffect, useTransition, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { IProductoFilters } from "@/app/types/producto.type";
import { EstadoGeneral } from "@/app/types/estados.type";
import { useCategorias } from "@/app/hooks/categorias/useCategorias";
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
    estado?: EstadoGeneral; // Estado del producto: 1 = Activo, 2 = Inactivo
    publicado?: boolean; // Publicado en tienda: true = publicado, false = no publicado
    stockBajo?: boolean;
    financiacion?: boolean;
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
    marcas: any[];
    grupos: any[];
    loadingCategorias: boolean;
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

/** Query flags: trim, case-insensitive; true / 1 / yes vs false / 0 / no */
function parseBoolean(value: string | null): boolean | undefined {
    if (value === null) return undefined;
    const v = value.trim().toLowerCase();
    if (v === "") return undefined;
    if (v === "false" || v === "0" || v === "no") return false;
    if (v === "true" || v === "1" || v === "yes") return true;
    return undefined;
}

// ============================================================================
// HOOK
// ============================================================================

export function useProductFilters(): UseProductFiltersReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const queryKey = searchParams.toString();
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

    // Obtener datos del backend (solo activos)
    const { data: categoriasResponse, isLoading: loadingCategorias } = useCategorias({ activeOnly: true });
    const { data: marcasResponse, isLoading: loadingMarcas } = useMarcas({ activeOnly: true });
    const { data: gruposResponse, isLoading: loadingGrupos } = useGrupos({ activeOnly: true });

    // Extraer los arrays de data
    const categorias = categoriasResponse?.data || [];
    const marcas = marcasResponse?.data || [];
    const grupos = gruposResponse?.data || [];

    const paramsRef = useRef<URLSearchParams>(new URLSearchParams(searchParams.toString()));

    useLayoutEffect(() => {
        paramsRef.current = new URLSearchParams(queryKey);
    }, [queryKey]);

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
    }, [queryKey, searchParams]);

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
                estado:
                    searchParams.get("estado") !== null
                        ? (parseNumber(searchParams.get("estado")) as EstadoGeneral)
                        : undefined,
                publicado:
                    searchParams.get("publicado") !== null
                        ? parseBoolean(searchParams.get("publicado"))
                        : undefined,
                stockBajo: parseBoolean(
                    searchParams.get("stockBajo") || searchParams.get("stock_bajo")
                ),
                financiacion: parseBoolean(searchParams.get("financiacion")),
            };
        },
        [queryKey, searchParams]
    );

    const sort = useMemo<SortOption | null>(() => {
        const orderBy = searchParams.get("order_by");
        const order = searchParams.get("order") as "asc" | "desc" | null;
        if (!orderBy || !order) return null;
        return { field: orderBy, order };
    }, [queryKey, searchParams]);

    const page = parseNumber(searchParams.get("page")) || 1;
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
                const params = new URLSearchParams(paramsRef.current.toString());
                params.set("order_by", field);
                params.set("order", order);
                params.set("page", "1");
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
                estado: "estado",
                publicado: "publicado",
                destacado: "destacado",
                oferta: "oferta",
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

    // Resolver codi_grupo: si la URL tiene "3" y en DB está "03", usar el valor real de la lista
    const resolvedCodiGrupo = useMemo(() => {
        if (!filters.grupo || !grupos?.length) return filters.grupo;
        const normalized = String(filters.grupo).trim().replace(/^0+/, '') || '0';
        const g = grupos.find((gr: { codi_grupo?: string }) =>
            String(gr.codi_grupo || '').trim().replace(/^0+/, '') === normalized
        );
        return g ? String(g.codi_grupo || '') : filters.grupo;
    }, [filters.grupo, grupos]);

    // Backend filters
    const backendFilters = useMemo<IProductoFilters>(() => {
        const backend: IProductoFilters = { page, limit };

        // Determinar si es admin o usuario (tienda)
        const isAdmin = pathname?.includes('/admin');
        
        // Para usuarios (tienda), solo mostrar productos publicados por defecto
        if (!isAdmin && filters.publicado === undefined) {
            backend.publicado = true;
        }

        if (filters.search) backend.busqueda = filters.search;
        if (filters.minPrice !== undefined) backend.precio_min = filters.minPrice;
        if (filters.maxPrice !== undefined) backend.precio_max = filters.maxPrice;
        if (filters.categoria) backend.id_cat = filters.categoria;
        // Asegurar que marca se pase correctamente (puede ser string o number)
        if (filters.marca !== undefined && filters.marca !== null && filters.marca !== '') {
            backend.id_marca = filters.marca;
        }
        if (resolvedCodiGrupo) backend.codi_grupo = resolvedCodiGrupo;
        if (filters.destacado !== undefined) backend.destacado = filters.destacado;
        // Filtros adicionales del admin
        if (filters.estado !== undefined) backend.estado = filters.estado;
        if (filters.publicado !== undefined) backend.publicado = filters.publicado;
        if (filters.stockBajo !== undefined) backend.stock_bajo = filters.stockBajo;
        if (filters.financiacion !== undefined) backend.financiacion = filters.financiacion;
        if (filters.oferta !== undefined) backend.oferta = filters.oferta;

        if (sort) {
            backend.order_by = sort.field as IProductoFilters["order_by"];
            backend.order = sort.order;
        } else {
            backend.order_by = "creado_en";
            backend.order = "desc";
        }

        return backend;
    }, [filters, sort, page, limit, pathname, resolvedCodiGrupo]);

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
            filters.estado !== undefined ||
            filters.publicado !== undefined ||
            filters.stockBajo === true,
        [filters]
    );

    // Contar filtros activos
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filters.search) count++;
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++;
        if (filters.categoria) count++;
        if (filters.marca) count++;
        if (filters.grupo) count++;
        if (filters.destacado === true) count++;
        if (filters.oferta === true) count++;
        if (filters.estado !== undefined) count++;
        if (filters.publicado !== undefined) count++;
        if (filters.stockBajo === true) count++;
        return count;
    }, [filters]);

    // Filtros combinados (compatible con ambos formatos: tienda y admin)
    const filtersCombined = useMemo<ProductFilters & IProductoFilters>(() => {
        const categoriaFromUrl = searchParams.get("categoria") || searchParams.get("id_cat") || null;
        const marcaFromUrl = searchParams.get("marca") || searchParams.get("id_marca") || null;
        const grupoFromUrl = searchParams.get("grupo") || searchParams.get("codi_grupo") || null;
        const searchFromUrl = searchParams.get("search") || searchParams.get("busqueda") || null;
        const estadoFromUrl = searchParams.get("estado");
        const publicadoFromUrl = searchParams.get("publicado");
        const destacadoFromUrl = searchParams.get("destacado");
        const ofertaFromUrl = searchParams.get("oferta");
        const stockBajoFromUrl =
            searchParams.get("stockBajo") || searchParams.get("stock_bajo") || null;

        return {
            ...filters,
            ...backendFilters,
            busqueda: searchFromUrl || filters.search || backendFilters.busqueda || undefined,
            precio_min:
                filters.minPrice ??
                backendFilters.precio_min ??
                parseNumber(searchParams.get("precio_min")) ??
                undefined,
            precio_max:
                filters.maxPrice ??
                backendFilters.precio_max ??
                parseNumber(searchParams.get("precio_max")) ??
                undefined,
            id_cat: categoriaFromUrl || filters.categoria || backendFilters.id_cat || undefined,
            id_marca: marcaFromUrl || filters.marca || backendFilters.id_marca || undefined,
            codi_grupo: grupoFromUrl || filters.grupo || backendFilters.codi_grupo || undefined,
            stock_bajo: stockBajoFromUrl
                ? parseBoolean(stockBajoFromUrl)
                : (filters.stockBajo ?? backendFilters.stock_bajo ?? undefined),
            estado:
                estadoFromUrl !== null
                    ? (parseNumber(estadoFromUrl) as EstadoGeneral)
                    : (filters.estado ?? backendFilters.estado ?? undefined),
            publicado:
                publicadoFromUrl !== null
                    ? parseBoolean(publicadoFromUrl)
                    : (filters.publicado ?? backendFilters.publicado ?? undefined),
            destacado:
                destacadoFromUrl !== null
                    ? parseBoolean(destacadoFromUrl)
                    : (filters.destacado ?? backendFilters.destacado ?? undefined),
            oferta:
                ofertaFromUrl !== null
                    ? parseBoolean(ofertaFromUrl)
                    : (filters.oferta ?? backendFilters.oferta ?? undefined),
        } as ProductFilters & IProductoFilters;
    }, [filters, backendFilters, queryKey, searchParams]);

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
        marcas,
        grupos,
        loadingCategorias,
        loadingMarcas,
        loadingGrupos,
    };
}