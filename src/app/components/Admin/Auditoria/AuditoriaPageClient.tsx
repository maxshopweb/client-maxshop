'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { AdminPageHeader } from '@/app/components/Admin/AdminPageHeader';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import { AuditoriaTableWrapper } from '@/app/components/tables/Auditoria/AuditoriaTableWrapper';
import { AuditoriaFilters } from '@/app/components/tables/Auditoria/AuditoriaFilters';
import { useAuditoriaFilters } from '@/app/hooks/auditoria/useAuditoriaFilters';
import { useAuditoria } from '@/app/hooks/auditoria/useAuditoria';
import type { AuditoriaLogsResponse } from '@/app/services/auditoria.service';

interface AuditoriaPageClientProps {
  initialData?: AuditoriaLogsResponse;
}

export function AuditoriaPageClient({ initialData }: AuditoriaPageClientProps) {
  const { filters } = useAuditoriaFilters();

  const effectiveInitialData =
    initialData &&
    initialData.pagination?.page === filters.page &&
    initialData.pagination?.limit === filters.limit
      ? initialData
      : undefined;

  const { refetch, isFetching } = useAuditoria({
    filters,
    initialData: effectiveInitialData,
  });

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Auditoría"
        description="Registro de acciones y cambios en el sistema"
      >
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline-primary"
          className="flex items-center gap-2 justify-center"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refrescar
        </Button>
      </AdminPageHeader>

      <AuditoriaFilters />

      <AuditoriaTableWrapper />
    </AdminPageContainer>
  );
}
