'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  UTILIDADES_DEFAULT_LIMIT,
  UTILIDADES_LIMIT_OPTIONS,
  normalizeUtilidadesLimit,
} from '@/app/types/admin-pagination.type';

const PARAM_PAGE = 'page';
const PARAM_LIMIT = 'limit';

function clampPage(p: number): number {
  return Number.isFinite(p) && p >= 1 ? Math.floor(p) : 1;
}

export function useUtilidadesPagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = useMemo(() => clampPage(Number(searchParams.get(PARAM_PAGE)) || 1), [searchParams]);

  const limit = useMemo(
    () => normalizeUtilidadesLimit(searchParams.get(PARAM_LIMIT) ?? undefined),
    [searchParams]
  );

  const replaceParams = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      const q = params.toString();
      router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setPage = useCallback(
    (next: number) => {
      const p = clampPage(next);
      replaceParams((params) => {
        if (p <= 1) params.delete(PARAM_PAGE);
        else params.set(PARAM_PAGE, String(p));
      });
    },
    [replaceParams]
  );

  const setLimit = useCallback(
    (nextLimit: number) => {
      const l = normalizeUtilidadesLimit(nextLimit);
      replaceParams((params) => {
        params.set(PARAM_LIMIT, String(l));
        params.delete(PARAM_PAGE);
      });
    },
    [replaceParams]
  );

  const goToPage = useCallback((p: number) => setPage(p), [setPage]);

  const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);

  const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    goToPage,
    nextPage,
    prevPage,
    limitOptions: UTILIDADES_LIMIT_OPTIONS,
    defaultLimit: UTILIDADES_DEFAULT_LIMIT,
  };
}
