import { Suspense } from 'react';
import {
  getMarcasPaginated,
  getCategoriasPaginated,
  getGruposPaginated,
  getListasPrecioPaginated,
} from '@/app/lib/getMaestros';
import { UtilidadesPageClient } from '@/app/components/Admin/Utilidades/UtilidadesPageClient';
import TableUtilidadesSkeleton from '@/app/components/skeletons/TableUtilidadesSkeleton';
import { normalizeUtilidadesLimit } from '@/app/types/admin-pagination.type';

type UtilidadesSearchParams = {
  page?: string;
  limit?: string;
  busqueda?: string;
};

interface UtilidadesPageProps {
  searchParams?: Promise<UtilidadesSearchParams> | UtilidadesSearchParams;
}

export default async function UtilidadesPage({ searchParams }: UtilidadesPageProps) {
  const raw = searchParams ?? {};
  const params =
    typeof (raw as Promise<unknown>).then === 'function'
      ? await (raw as Promise<UtilidadesSearchParams>)
      : (raw as UtilidadesSearchParams);

  const page = Math.max(1, Number(params.page) || 1);
  const limit = normalizeUtilidadesLimit(params.limit);
  const busqueda = (params.busqueda ?? '').trim().slice(0, 80);

  const [marcasRes, categoriasRes, gruposRes, listasRes] = await Promise.all([
    getMarcasPaginated(page, limit, busqueda),
    getCategoriasPaginated(page, limit, busqueda),
    getGruposPaginated(page, limit, busqueda),
    getListasPrecioPaginated(page, limit, ''),
  ]);

  return (
    <Suspense fallback={<TableUtilidadesSkeleton />}>
      <UtilidadesPageClient
        initialMarcasPaginated={marcasRes}
        initialCategoriasPaginated={categoriasRes}
        initialGruposPaginated={gruposRes}
        initialListasPaginated={listasRes}
      />
    </Suspense>
  );
}
