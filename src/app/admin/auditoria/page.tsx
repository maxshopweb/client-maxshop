import { Suspense } from 'react';
import { getAuditoriaLogs } from '@/app/lib/getAuditoria';
import { AuditoriaPageClient } from '@/app/components/Admin/Auditoria/AuditoriaPageClient';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';

type SearchParamsAuditoria = {
  page?: string;
  limit?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  accion?: string;
  tabla_afectada?: string;
  method?: string;
  estado?: string;
};

interface AuditoriaPageProps {
  searchParams?: Promise<SearchParamsAuditoria> | SearchParamsAuditoria;
}

export default async function AuditoriaPage({ searchParams }: AuditoriaPageProps) {
  const raw = searchParams ?? {};
  const params =
    typeof (raw as Promise<unknown>).then === 'function'
      ? await (raw as Promise<SearchParamsAuditoria>)
      : (raw as SearchParamsAuditoria);
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 50;
  const getParams: Parameters<typeof getAuditoriaLogs>[0] = { page, limit };
  if (params.fecha_desde) getParams.fecha_desde = params.fecha_desde;
  if (params.fecha_hasta) getParams.fecha_hasta = params.fecha_hasta;
  if (params.accion) getParams.accion = params.accion;
  if (params.tabla_afectada) getParams.tabla_afectada = params.tabla_afectada;
  if (params.method) getParams.method = params.method;
  if (params.estado) getParams.estado = params.estado;

  const initialData = await getAuditoriaLogs(getParams);

  return (
    <Suspense
      fallback={
        <AdminPageContainer>
          <TableSkeleton columnCount={8} rowCount={8} />
        </AdminPageContainer>
      }
    >
      <AuditoriaPageClient initialData={initialData} />
    </Suspense>
  );
}
