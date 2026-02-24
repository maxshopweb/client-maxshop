'use client';

import type { AuditoriaLog } from '@/app/services/auditoria.service';
import TableSkeleton from '@/app/components/skeletons/TableProductSkeleton';
import { TableBadge } from '@/app/components/ui/TableBadge';
import { FileText } from 'lucide-react';
import { useAuditoriaFilters } from '@/app/hooks/auditoria/useAuditoriaFilters';
import { useAuditoria } from '@/app/hooks/auditoria/useAuditoria';

function formatFechaHora(log: AuditoriaLog): string {
  if (log.fecha_iso) {
    try {
      const d = new Date(log.fecha_iso);
      return d.toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'medium',
      });
    } catch {
      return [log.dia, log.hora].filter(Boolean).join(' ') || '—';
    }
  }
  return [log.dia, log.hora].filter(Boolean).join(' ') || '—';
}

function formatUsuario(log: AuditoriaLog): string {
  const u = log.usuario;
  if (!u) return '—';
  const name = [u.nombre, u.apellido].filter(Boolean).join(' ').trim();
  if (name) return name;
  return u.email ?? '—';
}

function truncate(str: string | null | undefined, max = 50): string {
  if (!str) return '—';
  return str.length <= max ? str : str.slice(0, max) + '…';
}

export function AuditoriaTable() {
  const { filters } = useAuditoriaFilters();
  const { logs, isLoading, isError, error } = useAuditoria({ filters });

  if (isLoading) {
    return <TableSkeleton columnCount={8} rowCount={8} />;
  }

  if (isError) {
    return (
      <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-red-600 text-lg font-semibold mb-2">
            Error al cargar auditoría
          </div>
          <div className="text-gray-600 text-sm">
            {error?.message || 'Ocurrió un error inesperado'}
          </div>
        </div>
      </div>
    );
  }

  if (!logs.length) {
    return (
      <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <FileText className="w-16 h-16 text-gray-300 mb-4" />
          <div className="text-gray-600 text-lg font-semibold mb-2">
            No hay registros
          </div>
          <div className="text-gray-500 text-sm">
            No se encontraron eventos de auditoría.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-card rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                Fecha / Hora
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Acción
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tabla
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider max-w-[200px]">
                Descripción
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                Método
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-24">
                Estado
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                Tiempo
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id_aud} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                  {formatFechaHora(log)}
                </td>
                <td className="px-4 py-3 text-sm text-text">
                  {formatUsuario(log)}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-text">
                  {log.accion ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-text">
                  {log.tabla_afectada ?? '—'}
                </td>
                <td
                  className="px-4 py-3 text-sm text-text max-w-[200px] truncate"
                  title={log.descripcion ?? undefined}
                >
                  {truncate(log.descripcion, 40)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className="font-mono text-text">{log.method ?? '—'}</span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {log.estado === 'SUCCESS' ? (
                    <TableBadge variant="success">{log.estado}</TableBadge>
                  ) : log.estado === 'ERROR' ? (
                    <TableBadge variant="error">{log.estado}</TableBadge>
                  ) : (
                    <TableBadge variant="neutral">{log.estado ?? '—'}</TableBadge>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-text text-right">
                  {log.tiempo_procesamiento != null
                    ? `${log.tiempo_procesamiento} ms`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
