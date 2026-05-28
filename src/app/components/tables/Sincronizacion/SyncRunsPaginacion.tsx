'use client';

import { AdminTablePagination } from '@/app/components/ui/AdminTablePagination';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { SYNC_RUNS_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';

interface SyncRunsPaginacionProps {
  pagination: AdminPaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function SyncRunsPaginacion({
  pagination,
  onPageChange,
  onLimitChange,
  onNextPage,
  onPrevPage,
}: SyncRunsPaginacionProps) {
  return (
    <AdminTablePagination
      pagination={pagination}
      entityLabelPlural="corridas"
      limitOptions={SYNC_RUNS_LIMIT_OPTIONS}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
    />
  );
}
