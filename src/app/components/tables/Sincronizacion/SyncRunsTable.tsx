'use client';

import { RefreshCw } from 'lucide-react';
import type { SyncRun } from '@/app/services/sincronizacion.service';
import { SyncRunRow } from './SyncRunRow';

const TABLE_HEADERS = [
  'Fecha/hora',
  'Origen',
  'Estado',
  'Duración',
  'Descargados',
  'Convertidos',
  'Importados',
  'Errores',
  '',
] as const;

export interface SyncRunsTableProps {
  runs: SyncRun[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRefetch: () => void;
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
}

export function SyncRunsTable({
  runs,
  isLoading,
  isFetching,
  isError,
  onRefetch,
  expandedId,
  onToggleExpand,
}: SyncRunsTableProps) {
  return (
    <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50/80">
        <h2 className="text-sm font-semibold text-text">Historial de corridas</h2>
        <div className="flex items-center gap-3">
          {isFetching && !isLoading && (
            <RefreshCw size={14} className="animate-spin text-principal" aria-hidden />
          )}
          <button
            type="button"
            onClick={() => onRefetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-principal/10 text-principal hover:bg-principal/15"
          >
            <RefreshCw size={12} aria-hidden />
            Actualizar
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-gray-400">Cargando corridas...</div>
      ) : isError ? (
        <div className="p-8 text-center text-sm text-red-500">
          Error al cargar.{' '}
          <button type="button" onClick={() => onRefetch()} className="underline">
            Reintentar
          </button>
        </div>
      ) : runs.length === 0 ? (
        <div className="p-12 text-center">
          <RefreshCw size={32} className="mx-auto mb-3 opacity-20" aria-hidden />
          <p className="text-sm text-gray-400">
            Sin corridas registradas. La primera se ejecutará automáticamente en los próximos
            minutos.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {runs.map((run) => (
                <SyncRunRow
                  key={run.id}
                  run={run}
                  isExpanded={expandedId === run.id}
                  onToggle={() => onToggleExpand(run.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
