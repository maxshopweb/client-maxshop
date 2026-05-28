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

/** Opciones por defecto para tablas admin (productos, ventas, auditoría, clientes). */
export const ADMIN_TABLE_LIMIT_OPTIONS = [10, 25, 50, 100] as const;

export const PRODUCTOS_LIMIT_OPTIONS = [10, 21, 25, 50, 100] as const;

export const STAFF_LIMIT_OPTIONS = [10, 20, 25, 50, 100] as const;

export const UTILIDADES_LIMIT_OPTIONS = [10, 25, 50, 100] as const;
export const UTILIDADES_DEFAULT_LIMIT = 10;

export function normalizeUtilidadesLimit(raw: number | string | undefined): number {
  const n = typeof raw === 'string' ? Number(raw) : raw ?? UTILIDADES_DEFAULT_LIMIT;
  if (UTILIDADES_LIMIT_OPTIONS.includes(n as (typeof UTILIDADES_LIMIT_OPTIONS)[number])) {
    return n;
  }
  return UTILIDADES_DEFAULT_LIMIT;
}

export const SYNC_RUNS_LIMIT_OPTIONS = [25, 50, 100] as const;
export const SYNC_RUNS_DEFAULT_LIMIT = 50;

export function normalizeSyncRunsLimit(raw: number | string | undefined): number {
  const n = typeof raw === 'string' ? Number(raw) : raw ?? SYNC_RUNS_DEFAULT_LIMIT;
  if (SYNC_RUNS_LIMIT_OPTIONS.includes(n as (typeof SYNC_RUNS_LIMIT_OPTIONS)[number])) {
    return n;
  }
  return SYNC_RUNS_DEFAULT_LIMIT;
}

export interface PaginationMetaBase {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function toAdminPaginationMeta(p: PaginationMetaBase): AdminPaginationMeta {
  return {
    ...p,
    hasPrevPage: p.page > 1,
    hasNextPage: p.page < p.totalPages,
  };
}
