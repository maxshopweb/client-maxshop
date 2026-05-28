'use client';

import { AdminTablePagination } from '@/app/components/ui/AdminTablePagination';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { ADMIN_TABLE_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';
import { useVentasFilters } from '@/app/hooks/ventas/useVentasFilters';

interface VentasPaginationProps {
  pagination: AdminPaginationMeta;
}

export function VentasPagination({ pagination }: VentasPaginationProps) {
  const { nextPage, prevPage, goToPage, setFilter } = useVentasFilters();

  return (
    <AdminTablePagination
      pagination={pagination}
      entityLabelPlural="ventas"
      limitOptions={ADMIN_TABLE_LIMIT_OPTIONS}
      onPageChange={goToPage}
      onLimitChange={(n) => setFilter('limit', n)}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  );
}
