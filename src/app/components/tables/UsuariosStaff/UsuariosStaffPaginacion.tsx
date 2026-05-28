'use client';

import { AdminTablePagination } from '@/app/components/ui/AdminTablePagination';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { STAFF_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';

interface UsuariosStaffPaginacionProps {
  pagination: AdminPaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function UsuariosStaffPaginacion({
  pagination,
  onPageChange,
  onLimitChange,
  onNextPage,
  onPrevPage,
}: UsuariosStaffPaginacionProps) {
  return (
    <AdminTablePagination
      pagination={pagination}
      entityLabelPlural="usuarios"
      limitOptions={STAFF_LIMIT_OPTIONS}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
    />
  );
}
