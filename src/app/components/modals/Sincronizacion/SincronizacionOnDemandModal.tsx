'use client';

import { useCallback, useState } from 'react';
import { Database, DollarSign, Package, RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import SimpleModal from '@/app/components/modals/SimpleModal';
import { Button } from '@/app/components/ui/Button';
import {
  sincronizacionService,
  type SyncOnDemandTipo,
} from '@/app/services/sincronizacion.service';
import { syncKeys } from '@/app/hooks/sincronizacion/useSyncStats';
import axios from 'axios';

interface SincronizacionOnDemandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const OPCIONES: {
  id: SyncOnDemandTipo;
  titulo: string;
  descripcion: string;
  icon: typeof Database;
}[] = [
  {
    id: 'catalogo',
    titulo: 'Catálogo completo',
    descripcion:
      'Descarga todos los archivos del FTP, importa productos nuevos (como inactivos) y actualiza precios y stock.',
    icon: Database,
  },
  {
    id: 'precios',
    titulo: 'Solo precios',
    descripcion:
      'Descarga MAESPREC.DBF y actualiza precios. Respeta precios editados manualmente en el panel.',
    icon: DollarSign,
  },
  {
    id: 'stock',
    titulo: 'Solo stock',
    descripcion: 'Descarga MAESSTOK.DBF y actualiza stock y stock mínimo de todos los productos.',
    icon: Package,
  },
];

export function SincronizacionOnDemandModal({
  isOpen,
  onClose,
  onSuccess,
}: SincronizacionOnDemandModalProps) {
  const [tipoSeleccionado, setTipoSeleccionado] = useState<SyncOnDemandTipo>('catalogo');
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await sincronizacionService.triggerOnDemand(tipoSeleccionado);
      toast.success('Sincronización iniciada', {
        description: result.message ?? 'Proceso completado correctamente',
      });
      await queryClient.invalidateQueries({ queryKey: syncKeys.all });
      onSuccess?.();
      onClose();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 409) {
        toast.error('Sync automática en curso', {
          description:
            (e.response.data as { error?: string })?.error ??
            'Hay una sincronización automática en curso. Intente nuevamente en unos minutos.',
        });
        return;
      }
      toast.error('No se pudo sincronizar', {
        description: e instanceof Error ? e.message : 'Error desconocido',
      });
    } finally {
      setIsSyncing(false);
    }
  }, [tipoSeleccionado, queryClient, onClose, onSuccess]);

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title={
        <span className="flex items-center gap-2">
          <RefreshCw size={20} />
          Sincronizar ahora
        </span>
      }
      actions={() => (
        <>
          <Button variant="outline-secondary" onClick={onClose} disabled={isSyncing}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
          </Button>
        </>
      )}
    >
      <p className="text-sm mb-4" style={{ color: 'rgba(var(--foreground-rgb), 0.6)' }}>
        Elegí qué datos sincronizar desde el FTP. Si hay una sync automática en curso, se
        rechazará la operación.
      </p>

      <div className="flex flex-col gap-3">
        {OPCIONES.map((opcion) => {
          const Icon = opcion.icon;
          const selected = tipoSeleccionado === opcion.id;
          return (
            <button
              key={opcion.id}
              type="button"
              onClick={() => setTipoSeleccionado(opcion.id)}
              className="flex items-start gap-3 p-4 rounded-xl text-left transition-colors"
              style={{
                border: selected
                  ? '2px solid var(--principal)'
                  : '1px solid rgba(var(--foreground-rgb), 0.12)',
                backgroundColor: selected
                  ? 'rgba(var(--principal-rgb), 0.08)'
                  : 'rgba(var(--foreground-rgb), 0.02)',
              }}
            >
              <Icon
                size={20}
                className="mt-0.5 shrink-0"
                style={{ color: selected ? 'var(--principal)' : 'rgba(var(--foreground-rgb), 0.5)' }}
              />
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>
                  {opcion.titulo}
                </p>
                <p className="text-xs mt-1" style={{ color: 'rgba(var(--foreground-rgb), 0.55)' }}>
                  {opcion.descripcion}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </SimpleModal>
  );
}
