import { getMarcas, getCategorias, getGrupos } from '@/app/lib/getMaestros';
import { UtilidadesPageClient } from '@/app/components/Admin/Utilidades/UtilidadesPageClient';
import { Suspense } from 'react';
import TableUtilidadesSkeleton from '@/app/components/skeletons/TableUtilidadesSkeleton';

export default async function UtilidadesPage() {
  const [marcasRes, categoriasRes, gruposRes] = await Promise.all([
    getMarcas(),
    getCategorias(),
    getGrupos(),
  ]);

  return (
    <Suspense fallback={<TableUtilidadesSkeleton />}>
      <UtilidadesPageClient
        initialMarcas={marcasRes}
        initialCategorias={categoriasRes}
        initialGrupos={gruposRes}
      />
    </Suspense>
  );
}
