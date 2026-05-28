'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Database,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useSyncStats } from '@/app/hooks/sincronizacion/useSyncStats';
import { SyncResultadoBadge } from './SyncBadges';
import { formatFecha, formatHoras } from './sync-formatters';

const cardShellStyle = {
  backgroundColor: 'rgba(var(--foreground-rgb), 0.04)',
  border: '1px solid rgba(var(--foreground-rgb), 0.08)',
};

export function SyncStatsCards() {
  const { stats, isLoading, isError, refetch } = useSyncStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 animate-pulse"
            style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.05)' }}
          >
            <div
              className="h-4 w-24 rounded mb-3"
              style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.1)' }}
            />
            <div
              className="h-7 w-16 rounded"
              style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.1)' }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="rounded-xl p-5 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
        <WifiOff size={18} aria-hidden />
        <span className="text-sm">No se pudieron cargar las estadísticas.</span>
        <button type="button" onClick={() => refetch()} className="ml-auto text-xs underline">
          Reintentar
        </button>
      </div>
    );
  }

  const alertaSinExito = stats.horasSinExito !== null && stats.horasSinExito > 24;

  return (
    <>
      {alertaSinExito && (
        <div className="rounded-xl px-4 py-3 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          <AlertTriangle size={18} className="flex-shrink-0" aria-hidden />
          <span className="text-sm font-medium">
            Llevan <strong>{formatHoras(stats.horasSinExito)}</strong> sin una sincronización
            completa exitosa.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl p-5" style={cardShellStyle}>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={15} style={{ color: 'var(--principal)' }} aria-hidden />
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: 'rgba(var(--foreground-rgb), 0.5)' }}
            >
              Última corrida
            </span>
          </div>
          {stats.ultimaCorrida ? (
            <>
              <SyncResultadoBadge resultado={stats.ultimaCorrida.resultado} />
              <p className="mt-2 text-xs" style={{ color: 'rgba(var(--foreground-rgb), 0.6)' }}>
                {formatFecha(stats.ultimaCorrida.iniciado_en)}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: 'rgba(var(--foreground-rgb), 0.4)' }}>
              Sin datos
            </p>
          )}
        </div>

        <div className="rounded-xl p-5" style={cardShellStyle}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={15} className="text-green-500" aria-hidden />
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: 'rgba(var(--foreground-rgb), 0.5)' }}
            >
              Última completa
            </span>
          </div>
          {stats.ultimaExitosa ? (
            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
              {formatFecha(stats.ultimaExitosa.iniciado_en)}
            </p>
          ) : (
            <p className="text-sm" style={{ color: 'rgba(var(--foreground-rgb), 0.4)' }}>
              Sin datos
            </p>
          )}
        </div>

        <div
          className={`rounded-xl p-5 ${alertaSinExito ? 'border border-red-300 dark:border-red-700' : ''}`}
          style={{
            backgroundColor: alertaSinExito
              ? 'rgba(239, 68, 68, 0.06)'
              : 'rgba(var(--foreground-rgb), 0.04)',
            border: alertaSinExito ? undefined : '1px solid rgba(var(--foreground-rgb), 0.08)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            {alertaSinExito ? (
              <AlertTriangle size={15} className="text-red-500" aria-hidden />
            ) : (
              <Wifi size={15} className="text-green-500" aria-hidden />
            )}
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: 'rgba(var(--foreground-rgb), 0.5)' }}
            >
              Sin éxito hace
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: alertaSinExito ? '#ef4444' : 'var(--foreground)' }}
          >
            {formatHoras(stats.horasSinExito)}
          </p>
        </div>

        <div className="rounded-xl p-5" style={cardShellStyle}>
          <div className="flex items-center gap-2 mb-3">
            <Database size={15} style={{ color: 'var(--principal)' }} aria-hidden />
            <span
              className="text-xs font-medium uppercase tracking-wide"
              style={{ color: 'rgba(var(--foreground-rgb), 0.5)' }}
            >
              Tasa éxito 7 días
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            {stats.tasaExito7d}%
          </p>
          <p className="text-xs mt-1" style={{ color: 'rgba(var(--foreground-rgb), 0.5)' }}>
            {stats.exitosasUltimas24h}/{stats.totalUltimas24h} completas hoy
          </p>
        </div>
      </div>
    </>
  );
}
