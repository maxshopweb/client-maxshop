'use client';

import { useCallback, useMemo, useEffect, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { IStaffListParams } from '@/app/types/admin-staff.type';

const DEFAULT: IStaffListParams = {
  page: 1,
  limit: 20
};

function parseBool(v: string | null): boolean | undefined {
  if (v === null || v === '') return undefined;
  if (v === 'true' || v === '1') return true;
  if (v === 'false' || v === '0') return false;
  return undefined;
}

export function useAdminStaffFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebounce(localSearch, 400);

  const filters = useMemo<IStaffListParams>(() => {
    const p: IStaffListParams = { ...DEFAULT };

    const page = searchParams.get('page');
    if (page) p.page = Math.max(1, Number(page) || 1);

    const limit = searchParams.get('limit');
    if (limit) p.limit = Math.min(100, Math.max(1, Number(limit) || DEFAULT.limit!));

    const search = searchParams.get('search');
    if (search) p.search = search;

    const nombre = searchParams.get('nombre');
    if (nombre) p.nombre = nombre;

    const apellido = searchParams.get('apellido');
    if (apellido) p.apellido = apellido;

    const email = searchParams.get('email');
    if (email) p.email = email;

    const rol = searchParams.get('rol');
    if (rol === 'ADMIN' || rol === 'USER') p.rol = rol;

    const activo = parseBool(searchParams.get('activo'));
    if (activo !== undefined) p.activo = activo;

    return p;
  }, [searchParams]);

  useEffect(() => {
    const s = searchParams.get('search');
    setLocalSearch(s || '');
  }, [searchParams]);

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router]
  );

  /** Sincroniza búsqueda debounced → URL (página 1). */
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    if (debouncedSearch === urlSearch) return;
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());
    else params.delete('search');
    params.set('page', '1');
    pushParams(params);
  }, [debouncedSearch]);

  const updateURL = useCallback(
    (next: IStaffListParams) => {
      const params = new URLSearchParams();
      const merged = { ...DEFAULT, ...next };
      Object.entries(merged).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (key === 'activo' && typeof value === 'boolean') {
          params.set(key, value ? 'true' : 'false');
          return;
        }
        params.set(key, String(value));
      });
      pushParams(params);
    },
    [pushParams]
  );

  const setFilter = useCallback(
    <K extends keyof IStaffListParams>(key: K, value: IStaffListParams[K]) => {
      if (key === 'search') {
        setLocalSearch((value as string) || '');
        return;
      }
      const next = { ...filters, [key]: value };
      if (key !== 'page') next.page = 1;
      updateURL(next);
    },
    [filters, updateURL]
  );

  const setFilters = useCallback(
    (partial: Partial<IStaffListParams>) => {
      const next = { ...filters, ...partial };
      if (partial.page === undefined) next.page = 1;
      updateURL(next);
    },
    [filters, updateURL]
  );

  const clearFilters = useCallback(() => {
    setLocalSearch('');
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const goToPage = useCallback(
    (page: number) => updateURL({ ...filters, page }),
    [filters, updateURL]
  );

  const nextPage = useCallback(() => {
    goToPage((filters.page ?? 1) + 1);
  }, [filters.page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(Math.max(1, (filters.page ?? 1) - 1));
  }, [filters.page, goToPage]);

  const activeFiltersCount = useMemo(() => {
    let n = 0;
    if (filters.search) n++;
    if (filters.nombre) n++;
    if (filters.apellido) n++;
    if (filters.email) n++;
    if (filters.rol) n++;
    if (filters.activo !== undefined) n++;
    return n;
  }, [filters]);

  const hasActiveFilters = activeFiltersCount > 0;

  return {
    filters,
    localSearch,
    setLocalSearch,
    setFilter,
    setFilters,
    clearFilters,
    goToPage,
    nextPage,
    prevPage,
    activeFiltersCount,
    hasActiveFilters
  };
}

export type AdminStaffFiltersState = ReturnType<typeof useAdminStaffFilters>;
