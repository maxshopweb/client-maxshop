'use client';

import { Suspense } from 'react';
import { AdminPageContainer } from '@/app/components/Admin/AdminPageContainer';
import { SincronizacionPageClient } from '@/app/components/Admin/Sincronizacion/SincronizacionPageClient';
import TableProductSkeleton from '@/app/components/skeletons/TableProductSkeleton';

export default function SincronizacionPage() {
  return (
    <AdminPageContainer>
      <Suspense fallback={<TableProductSkeleton />}>
        <SincronizacionPageClient />
      </Suspense>
    </AdminPageContainer>
  );
}
