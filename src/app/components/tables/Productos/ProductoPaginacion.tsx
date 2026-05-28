'use client';

import { AdminTablePagination } from '@/app/components/ui/AdminTablePagination';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { PRODUCTOS_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';
import { useProductFilters } from '@/app/hooks/productos/useProductFilters';

interface ProductosPaginationProps {
  pagination: AdminPaginationMeta;
}

export function ProductosPagination({ pagination }: ProductosPaginationProps) {
  const { nextPage, prevPage, goToPage, setFilter } = useProductFilters();

  return (
    <AdminTablePagination
      pagination={pagination}
      entityLabelPlural="productos"
      limitOptions={PRODUCTOS_LIMIT_OPTIONS}
      onPageChange={goToPage}
      onLimitChange={(n) => setFilter('limit', n)}
      onNextPage={nextPage}
      onPrevPage={prevPage}
    />
  );
}
