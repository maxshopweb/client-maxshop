'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { SincronizacionOnDemandModal } from '@/app/components/modals/Sincronizacion/SincronizacionOnDemandModal';
import { SyncStatsCards } from './SyncStatsCards';
import { SyncRunsTableWrapper } from '@/app/components/tables/Sincronizacion/SyncRunsTableWrapper';

export function SincronizacionPageClient() {
  const [showOnDemandModal, setShowOnDemandModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            Sincronización FTP
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(var(--foreground-rgb), 0.5)' }}>
            Monitoreo del proceso automático de integración con el sistema externo. Actualización
            automática cada 20 minutos.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowOnDemandModal(true)}>
          <RefreshCw size={14} className="mr-1.5" aria-hidden />
          Sincronizar ahora
        </Button>
      </div>

      <SyncStatsCards />
      <SyncRunsTableWrapper />

      {showOnDemandModal && (
        <SincronizacionOnDemandModal
          isOpen={showOnDemandModal}
          onClose={() => setShowOnDemandModal(false)}
        />
      )}
    </>
  );
}
