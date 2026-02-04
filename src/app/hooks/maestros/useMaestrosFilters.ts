'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useDebounce } from '@/app/hooks/useDebounce';
import type { MaestroKind, MaestroItem } from '@/app/types/maestro.type';
import { getMaestroCodigo, getMaestroNombre } from '@/app/types/maestro.type';

const PARAM_BUSQUEDA = 'busqueda';
const MAX_BUSQUEDA_LENGTH = 80;
const DEBOUNCE_MS = 300;

/** Normaliza texto para búsqueda: trim, lowercase, sin acentos */
function normalizeForSearch(value: string): string {
  const trimmed = value.trim().toLowerCase();
  return trimmed.normalize('NFD').replace(/\p{Diacritic}/gu, '') ?? trimmed;
}

/** Valida y normaliza el valor para guardar en URL: trim, max length */
function validateBusqueda(value: string): string {
  return value.trim().slice(0, MAX_BUSQUEDA_LENGTH);
}

export interface UseMaestrosFiltersReturn {
  /** Valor para el input (estado local, actualización inmediata = tipeo fluido) */
  busquedaInput: string;
  /** Actualiza solo el input; la URL se actualiza con debounce */
  setBusquedaInput: (value: string) => void;
  /** Valor en URL (para filtrar); viene del debounce */
  busqueda: string;
  /** Filtra items por nombre o código (normalizado). Reutilizable para marca, categoria, grupo */
  filterItems: (items: MaestroItem[], kind: MaestroKind) => MaestroItem[];
  /** Si hay filtro activo */
  hasFilter: boolean;
  /** Limpia el filtro (input + URL) */
  clearBusqueda: () => void;
}

export function useMaestrosFilters(): UseMaestrosFiltersReturn {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const busquedaFromUrl = useMemo(() => {
    const raw = searchParams.get(PARAM_BUSQUEDA) ?? '';
    return validateBusqueda(raw);
  }, [searchParams]);

  const [busquedaInput, setBusquedaInputState] = useState(busquedaFromUrl);

  const debouncedInput = useDebounce(busquedaInput, DEBOUNCE_MS);

  useEffect(() => {
    setBusquedaInputState(busquedaFromUrl);
  }, [busquedaFromUrl]);

  const setBusquedaToUrl = useCallback(
    (value: string) => {
      const validated = validateBusqueda(value);
      const params = new URLSearchParams(searchParams.toString());
      if (validated === '') {
        params.delete(PARAM_BUSQUEDA);
      } else {
        params.set(PARAM_BUSQUEDA, validated);
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    if (debouncedInput !== busquedaFromUrl) {
      setBusquedaToUrl(debouncedInput);
    }
  }, [debouncedInput, busquedaFromUrl, setBusquedaToUrl]);

  const setBusquedaInput = useCallback((value: string) => {
    setBusquedaInputState(value.slice(0, MAX_BUSQUEDA_LENGTH));
  }, []);

  const clearBusqueda = useCallback(() => {
    setBusquedaInputState('');
    setBusquedaToUrl('');
  }, [setBusquedaToUrl]);

  const busqueda = busquedaFromUrl;

  const filterItems = useCallback(
    (items: MaestroItem[], kind: MaestroKind): MaestroItem[] => {
      const term = normalizeForSearch(busqueda);
      if (!term) return items;
      return items.filter((item) => {
        const codigo = getMaestroCodigo(item, kind);
        const nombre = getMaestroNombre(item) ?? '';
        return (
          normalizeForSearch(codigo).includes(term) ||
          normalizeForSearch(nombre).includes(term)
        );
      });
    },
    [busqueda]
  );

  const hasFilter = busqueda.length > 0;

  return {
    busquedaInput,
    setBusquedaInput,
    busqueda,
    filterItems,
    hasFilter,
    clearBusqueda,
  };
}
