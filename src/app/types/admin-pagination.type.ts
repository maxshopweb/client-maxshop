export interface AdminPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedListResponse<T> {
  success: boolean;
  data: T[];
  pagination: AdminPaginationMeta;
}

export const UTILIDADES_LIMIT_OPTIONS = [10, 25, 50, 100] as const;
export const UTILIDADES_DEFAULT_LIMIT = 10;

export function normalizeUtilidadesLimit(raw: number | string | undefined): number {
  const n = typeof raw === 'string' ? Number(raw) : raw ?? UTILIDADES_DEFAULT_LIMIT;
  if (UTILIDADES_LIMIT_OPTIONS.includes(n as (typeof UTILIDADES_LIMIT_OPTIONS)[number])) {
    return n;
  }
  return UTILIDADES_DEFAULT_LIMIT;
}
