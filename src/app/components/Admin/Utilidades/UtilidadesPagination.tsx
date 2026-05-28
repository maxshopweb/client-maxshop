'use client';

import { AdminTablePagination } from '@/app/components/ui/AdminTablePagination';
import type { AdminPaginationMeta } from '@/app/types/admin-pagination.type';
import { ADMIN_TABLE_LIMIT_OPTIONS } from '@/app/types/admin-pagination.type';

interface UtilidadesPaginationProps {
  pagination: AdminPaginationMeta;
  entityLabelPlural: string;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export function UtilidadesPagination(props: UtilidadesPaginationProps) {
  return (
    <AdminTablePagination
      {...props}
      limitOptions={ADMIN_TABLE_LIMIT_OPTIONS}
      className="mt-4"
    />
  );
}
