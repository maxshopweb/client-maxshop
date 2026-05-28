'use client';

import { AdminTablePagination } from '@/app/components/ui/AdminTablePagination';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { ADMIN_TABLE_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';
import { useAuditoriaFilters } from '@/app/hooks/auditoria/useAuditoriaFilters';

interface AuditoriaPaginationProps {
  pagination: AdminPaginationMeta;
}

export function AuditoriaPagination({ pagination }: AuditoriaPaginationProps) {
  const { nextPage, prevPage, goToPage, setFilter } = useAuditoriaFilters();

  return (
    <AdminTablePagination
      pagination={pagination}
      entityLabelPlural="registros"
      limitOptions={ADMIN_TABLE_LIMIT_OPTIONS}
      onPageChange={goToPage}
      onLimitChange={(n) => setFilter('limit', n)}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  );
}
