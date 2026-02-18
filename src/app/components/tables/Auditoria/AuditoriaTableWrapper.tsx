'use client';

import { AuditoriaTable } from './AuditoriaTable';
import { AuditoriaPagination } from './AuditoriaPagination';
import { useAuditoriaFilters } from '@/app/hooks/auditoria/useAuditoriaFilters';
import { useAuditoria } from '@/app/hooks/auditoria/useAuditoria';

export function AuditoriaTableWrapper() {
  const { filters } = useAuditoriaFilters();
  const { pagination } = useAuditoria({ filters });

  return (
    <div className="space-y-4">
      <AuditoriaTable />

      {pagination && <AuditoriaPagination pagination={pagination} />}
    </div>
  );
}
