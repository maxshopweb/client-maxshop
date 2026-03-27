'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export interface AuditoriaFilters {
  page: number;
  limit: number;
  fecha_desde?: string;
  fecha_hasta?: string;
  tabla_afectada?: string;
  method?: string;
  estado?: string;
}

const DEFAULT_FILTERS: AuditoriaFilters = {
  page: 1,
  limit: 50,
};

const FILTER_KEYS: (keyof Omit<AuditoriaFilters, 'page' | 'limit'>)[] = [
  'fecha_desde',
  'fecha_hasta',
  'tabla_afectada',
  'method',
  'estado',
];

function toParams(f: AuditoriaFilters): URLSearchParams {
  const params = new URLSearchParams();
  params.set('page', String(f.page));
  params.set('limit', String(f.limit));
  FILTER_KEYS.forEach((key) => {
    const v = f[key];
    if (v !== undefined && v !== null && v !== '') {
      params.set(key, String(v));
    }
  });
  return params;
}

export function useAuditoriaFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo<AuditoriaFilters>(() => {
    const params: AuditoriaFilters = { ...DEFAULT_FILTERS };

    const page = searchParams.get('page');
    if (page) params.page = Number(page) || 1;

    const limit = searchParams.get('limit');
    if (limit) params.limit = Number(limit) || 50;

    const fecha_desde = searchParams.get('fecha_desde');
    if (fecha_desde) params.fecha_desde = fecha_desde;

    const fecha_hasta = searchParams.get('fecha_hasta');
    if (fecha_hasta) params.fecha_hasta = fecha_hasta;

    const tabla_afectada = searchParams.get('tabla_afectada');
    if (tabla_afectada) params.tabla_afectada = tabla_afectada;

    const method = searchParams.get('method');
    if (method) params.method = method;

    const estado = searchParams.get('estado');
    if (estado) params.estado = estado;

    return params;
  }, [searchParams]);

  const updateURL = useCallback(
    (newFilters: AuditoriaFilters) => {
      router.push(`${pathname}?${toParams(newFilters).toString()}`, { scroll: false });
    },
    [pathname, router]
  );

  const setFilter = useCallback(
    <K extends keyof AuditoriaFilters>(key: K, value: AuditoriaFilters[K]) => {
      const newFilters = { ...filters, [key]: value };
      if (key !== 'page' && key !== 'limit') {
        newFilters.page = 1;
      }
      updateURL(newFilters);
    },
    [filters, updateURL]
  );

  const nextPage = useCallback(() => {
    setFilter('page', filters.page + 1);
  }, [filters.page, setFilter]);

  const prevPage = useCallback(() => {
    if (filters.page > 1) {
      setFilter('page', filters.page - 1);
    }
  }, [filters.page, setFilter]);

  const goToPage = useCallback(
    (page: number) => {
      setFilter('page', page);
    },
    [setFilter]
  );

  const clearFilters = useCallback(() => {
    updateURL(DEFAULT_FILTERS);
  }, [updateURL]);

  const hasActiveFilters = useMemo(() => {
    return FILTER_KEYS.some((key) => {
      const v = filters[key];
      return v !== undefined && v !== null && v !== '';
    });
  }, [filters]);

  const activeFiltersCount = useMemo(() => {
    return FILTER_KEYS.filter((key) => {
      const v = filters[key];
      return v !== undefined && v !== null && v !== '';
    }).length;
  }, [filters]);

  return {
    filters,
    setFilter,
    nextPage,
    prevPage,
    goToPage,
    clearFilters,
    hasActiveFilters,
    activeFiltersCount,
  };
}
