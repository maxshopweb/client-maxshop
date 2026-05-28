'use client';

import { AdminTablePagination } from '@/app/components/ui/AdminTablePagination';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { ADMIN_TABLE_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';

interface ClientesPaginacionProps {
  pagination: AdminPaginationMeta;
}

export function ClientesPaginacion({ pagination }: ClientesPaginacionProps) {
  const { goToPage, nextPage, prevPage, setFilter } = useClientesFilters();

  return (
    <AdminTablePagination
      pagination={pagination}
      entityLabelPlural="clientes"
      limitOptions={ADMIN_TABLE_LIMIT_OPTIONS}
      onPageChange={goToPage}
      onLimitChange={(n) => setFilter('limit', n)}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  );
}
