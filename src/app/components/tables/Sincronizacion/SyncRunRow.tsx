'use client';

import {
  ChevronDown,
  ChevronUp,
  Database,
  Download,
  FileText,
} from 'lucide-react';
import type { SyncRun } from '@/app/services/sincronizacion.service';
import { TableBadge } from '@/app/components/ui/TableBadge';
import {
  SyncErroresCountBadge,
  SyncResultadoBadge,
  SyncTriggerBadge,
} from '@/app/components/Admin/Sincronizacion/SyncBadges';
import { SyncErroresDetalle } from '@/app/components/Admin/Sincronizacion/SyncErroresDetalle';
import { formatDuracion, formatFecha } from '@/app/components/Admin/Sincronizacion/sync-formatters';

interface SyncRunRowProps {
  run: SyncRun;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SyncRunRow({ run, isExpanded, onToggle }: SyncRunRowProps) {
  const erroresArr = Array.isArray(run.errores) ? run.errores : [];

  return (
    <>
      <tr
        className="border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50"
        style={{
          backgroundColor: isExpanded ? 'rgba(var(--principal-rgb), 0.04)' : undefined,
        }}
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-xs whitespace-nowrap text-gray-600">
          {formatFecha(run.iniciado_en)}
        </td>
        <td className="px-4 py-3">
          <SyncTriggerBadge trigger={run.trigger} />
        </td>
        <td className="px-4 py-3">
          <SyncResultadoBadge resultado={run.resultado} />
        </td>
        <td className="px-4 py-3 text-xs font-mono text-gray-600">
          {formatDuracion(run.duracion_ms)}
        </td>
        <td className="px-4 py-3 text-xs text-center text-gray-700">
          <span className="flex items-center justify-center gap-1">
            <Download size={11} aria-hidden />
            {run.archivos_descargados}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-center text-gray-700">
          <span className="flex items-center justify-center gap-1">
            <FileText size={11} aria-hidden />
            {run.archivos_convertidos}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-center text-gray-700">
          <span className="flex items-center justify-center gap-1">
            <Database size={11} aria-hidden />
            {run.archivos_importados}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-center">
          {erroresArr.length > 0 ? (
            <SyncErroresCountBadge count={erroresArr.length} />
          ) : (
            <span className="text-gray-300">—</span>
          )}
        </td>
        <td className="px-4 py-3 text-xs text-center text-gray-400">
          {isExpanded ? <ChevronUp size={14} aria-hidden /> : <ChevronDown size={14} aria-hidden />}
        </td>
      </tr>

      {isExpanded && (
        <tr className="bg-gray-50/80">
          <td colSpan={9} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-500">
                  Detalle
                </p>
                <dl className="space-y-1 text-xs">
                  <div className="flex gap-2">
                    <dt className="text-gray-500">Inicio:</dt>
                    <dd className="text-text">{formatFecha(run.iniciado_en)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500">Fin:</dt>
                    <dd className="text-text">{formatFecha(run.finalizado_en)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-gray-500">Duración:</dt>
                    <dd className="text-text">{formatDuracion(run.duracion_ms)}</dd>
                  </div>
                  {run.total_registros !== null && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500">Registros BD:</dt>
                      <dd className="text-text">
                        {run.total_registros.toLocaleString('es-AR')}
                      </dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt className="text-gray-500">JSON FTP:</dt>
                    <dd>
                      {run.ftp_json_subido ? (
                        <TableBadge variant="success">Subido</TableBadge>
                      ) : (
                        <TableBadge variant="neutral">No subido</TableBadge>
                      )}
                    </dd>
                  </div>
                  {run.mensaje && (
                    <div className="flex gap-2">
                      <dt className="text-gray-500">Mensaje:</dt>
                      <dd className="text-text">{run.mensaje}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide text-gray-500">
                  Errores ({erroresArr.length})
                </p>
                <SyncErroresDetalle errores={erroresArr} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
