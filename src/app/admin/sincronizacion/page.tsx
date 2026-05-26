"use client";

import { useState } from "react";
import { AdminPageContainer } from "@/app/components/Admin/AdminPageContainer";
import { useSyncStats } from "@/app/hooks/sincronizacion/useSyncStats";
import { useSyncRuns } from "@/app/hooks/sincronizacion/useSyncRuns";
import type { SyncRun } from "@/app/services/sincronizacion.service";
import {
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  FileText,
  Database,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
} from "lucide-react";

// ─── Utilidades ───────────────────────────────────────────────────────────────

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDuracion(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function formatHoras(h: number | null): string {
  if (h === null) return "—";
  if (h < 1) return `${Math.round(h * 60)} min`;
  return `${h.toFixed(1)} hs`;
}

// ─── Badge de resultado ───────────────────────────────────────────────────────

function ResultadoBadge({ resultado }: { resultado: string }) {
  if (resultado === "COMPLETA") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
        <CheckCircle2 size={11} />
        Completa
      </span>
    );
  }
  if (resultado === "PARCIAL") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
        <AlertTriangle size={11} />
        Parcial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
      <XCircle size={11} />
      Fallida
    </span>
  );
}

// ─── Badge de trigger ─────────────────────────────────────────────────────────

function TriggerBadge({ trigger }: { trigger: string }) {
  if (trigger === "AUTO") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
        <RefreshCw size={10} />
        Auto
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
      Manual
    </span>
  );
}

// ─── Cards de estadísticas ────────────────────────────────────────────────────

function StatsCards() {
  const { stats, isLoading, isError, refetch } = useSyncStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl p-5 animate-pulse"
            style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.05)" }}
          >
            <div className="h-4 w-24 rounded mb-3" style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.1)" }} />
            <div className="h-7 w-16 rounded" style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.1)" }} />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="rounded-xl p-5 flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
        <WifiOff size={18} />
        <span className="text-sm">No se pudieron cargar las estadísticas.</span>
        <button onClick={() => refetch()} className="ml-auto text-xs underline">
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
          <AlertTriangle size={18} className="flex-shrink-0" />
          <span className="text-sm font-medium">
            Llevan <strong>{formatHoras(stats.horasSinExito)}</strong> sin una sincronización completa exitosa.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Última corrida */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.04)", border: "1px solid rgba(var(--foreground-rgb), 0.08)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Clock size={15} style={{ color: "var(--principal)" }} />
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
              Última corrida
            </span>
          </div>
          {stats.ultimaCorrida ? (
            <>
              <ResultadoBadge resultado={stats.ultimaCorrida.resultado} />
              <p className="mt-2 text-xs" style={{ color: "rgba(var(--foreground-rgb), 0.6)" }}>
                {formatFecha(stats.ultimaCorrida.iniciado_en)}
              </p>
            </>
          ) : (
            <p className="text-sm" style={{ color: "rgba(var(--foreground-rgb), 0.4)" }}>Sin datos</p>
          )}
        </div>

        {/* Última completa */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.04)", border: "1px solid rgba(var(--foreground-rgb), 0.08)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={15} className="text-green-500" />
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
              Última completa
            </span>
          </div>
          {stats.ultimaExitosa ? (
            <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {formatFecha(stats.ultimaExitosa.iniciado_en)}
            </p>
          ) : (
            <p className="text-sm" style={{ color: "rgba(var(--foreground-rgb), 0.4)" }}>Sin datos</p>
          )}
        </div>

        {/* Horas sin éxito */}
        <div
          className={`rounded-xl p-5 ${alertaSinExito ? "border border-red-300 dark:border-red-700" : ""}`}
          style={{
            backgroundColor: alertaSinExito
              ? "rgba(239, 68, 68, 0.06)"
              : "rgba(var(--foreground-rgb), 0.04)",
            border: alertaSinExito ? undefined : "1px solid rgba(var(--foreground-rgb), 0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            {alertaSinExito ? (
              <AlertTriangle size={15} className="text-red-500" />
            ) : (
              <Wifi size={15} className="text-green-500" />
            )}
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
              Sin éxito hace
            </span>
          </div>
          <p
            className="text-2xl font-bold"
            style={{ color: alertaSinExito ? "#ef4444" : "var(--foreground)" }}
          >
            {formatHoras(stats.horasSinExito)}
          </p>
        </div>

        {/* Tasa éxito 7d */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.04)", border: "1px solid rgba(var(--foreground-rgb), 0.08)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Database size={15} style={{ color: "var(--principal)" }} />
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
              Tasa éxito 7 días
            </span>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            {stats.tasaExito7d}%
          </p>
          <p className="text-xs mt-1" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
            {stats.exitosasUltimas24h}/{stats.totalUltimas24h} completas hoy
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Detalle expandible de errores ───────────────────────────────────────────

function ErroresDetalle({ errores }: { errores: string[] }) {
  if (!errores || errores.length === 0) {
    return (
      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
        <CheckCircle2 size={12} /> Sin errores registrados
      </p>
    );
  }
  return (
    <ul className="space-y-1 max-h-40 overflow-y-auto">
      {errores.map((e, i) => (
        <li key={i} className="text-xs flex items-start gap-1.5 text-red-700 dark:text-red-400">
          <XCircle size={11} className="flex-shrink-0 mt-0.5" />
          <span className="break-all">{e}</span>
        </li>
      ))}
    </ul>
  );
}

// ─── Fila de la tabla con detalle expandible ──────────────────────────────────

function RunRow({ run, isExpanded, onToggle }: {
  run: SyncRun;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const erroresArr = Array.isArray(run.errores) ? run.errores : [];

  return (
    <>
      <tr
        className="border-b cursor-pointer transition-colors hover:bg-opacity-50"
        style={{
          borderColor: "rgba(var(--foreground-rgb), 0.07)",
          backgroundColor: isExpanded ? "rgba(var(--principal-rgb), 0.04)" : "transparent",
        }}
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: "rgba(var(--foreground-rgb), 0.7)" }}>
          {formatFecha(run.iniciado_en)}
        </td>
        <td className="px-4 py-3">
          <TriggerBadge trigger={run.trigger} />
        </td>
        <td className="px-4 py-3">
          <ResultadoBadge resultado={run.resultado} />
        </td>
        <td className="px-4 py-3 text-xs font-mono" style={{ color: "rgba(var(--foreground-rgb), 0.7)" }}>
          {formatDuracion(run.duracion_ms)}
        </td>
        <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(var(--foreground-rgb), 0.8)" }}>
          <span className="flex items-center justify-center gap-1">
            <Download size={11} />
            {run.archivos_descargados}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(var(--foreground-rgb), 0.8)" }}>
          <span className="flex items-center justify-center gap-1">
            <FileText size={11} />
            {run.archivos_convertidos}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(var(--foreground-rgb), 0.8)" }}>
          <span className="flex items-center justify-center gap-1">
            <Database size={11} />
            {run.archivos_importados}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-center">
          {erroresArr.length > 0 ? (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold">
              {erroresArr.length}
            </span>
          ) : (
            <span style={{ color: "rgba(var(--foreground-rgb), 0.3)" }}>—</span>
          )}
        </td>
        <td className="px-4 py-3 text-xs text-center" style={{ color: "rgba(var(--foreground-rgb), 0.4)" }}>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>

      {isExpanded && (
        <tr style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.02)" }}>
          <td colSpan={9} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
                  Detalle
                </p>
                <dl className="space-y-1 text-xs">
                  <div className="flex gap-2">
                    <dt style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>Inicio:</dt>
                    <dd style={{ color: "var(--foreground)" }}>{formatFecha(run.iniciado_en)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>Fin:</dt>
                    <dd style={{ color: "var(--foreground)" }}>{formatFecha(run.finalizado_en)}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>Duración:</dt>
                    <dd style={{ color: "var(--foreground)" }}>{formatDuracion(run.duracion_ms)}</dd>
                  </div>
                  {run.total_registros !== null && (
                    <div className="flex gap-2">
                      <dt style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>Registros BD:</dt>
                      <dd style={{ color: "var(--foreground)" }}>{run.total_registros.toLocaleString("es-AR")}</dd>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <dt style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>JSON FTP:</dt>
                    <dd>
                      {run.ftp_json_subido ? (
                        <span className="text-green-600 dark:text-green-400">Subido</span>
                      ) : (
                        <span style={{ color: "rgba(var(--foreground-rgb), 0.4)" }}>No subido</span>
                      )}
                    </dd>
                  </div>
                  {run.mensaje && (
                    <div className="flex gap-2">
                      <dt style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>Mensaje:</dt>
                      <dd style={{ color: "var(--foreground)" }}>{run.mensaje}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <div>
                <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
                  Errores ({erroresArr.length})
                </p>
                <ErroresDetalle errores={erroresArr} />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Tabla de corridas ────────────────────────────────────────────────────────

function TablaRuns() {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { runs, pagination, isLoading, isFetching, isError, refetch } = useSyncRuns({ page, limit: 50 });

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(var(--foreground-rgb), 0.08)" }}
    >
      {/* Header de la tabla */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          backgroundColor: "rgba(var(--foreground-rgb), 0.03)",
          borderBottom: "1px solid rgba(var(--foreground-rgb), 0.08)",
        }}
      >
        <h2 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Historial de corridas
        </h2>
        <div className="flex items-center gap-3">
          {isFetching && !isLoading && (
            <RefreshCw size={14} className="animate-spin" style={{ color: "var(--principal)" }} />
          )}
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              backgroundColor: "rgba(var(--principal-rgb), 0.1)",
              color: "var(--principal)",
            }}
          >
            <RefreshCw size={12} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className="p-8 text-center text-sm" style={{ color: "rgba(var(--foreground-rgb), 0.4)" }}>
          Cargando corridas...
        </div>
      ) : isError ? (
        <div className="p-8 text-center text-sm text-red-500">
          Error al cargar. <button onClick={() => refetch()} className="underline">Reintentar</button>
        </div>
      ) : runs.length === 0 ? (
        <div className="p-12 text-center">
          <RefreshCw size={32} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm" style={{ color: "rgba(var(--foreground-rgb), 0.4)" }}>
            Sin corridas registradas. La primera se ejecutará automáticamente en los próximos minutos.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "rgba(var(--foreground-rgb), 0.03)" }}>
                {["Fecha/hora", "Origen", "Estado", "Duración", "Descargados", "Convertidos", "Importados", "Errores", ""].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "rgba(var(--foreground-rgb), 0.4)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runs.map(run => (
                <RunRow
                  key={run.id}
                  run={run}
                  isExpanded={expandedId === run.id}
                  onToggle={() => toggleExpand(run.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {pagination && pagination.totalPages > 1 && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            borderTop: "1px solid rgba(var(--foreground-rgb), 0.08)",
            backgroundColor: "rgba(var(--foreground-rgb), 0.02)",
          }}
        >
          <p className="text-xs" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
            {pagination.total} corridas totales — Página {pagination.page} de {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={pagination.page <= 1}
              className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 transition-colors"
              style={{
                backgroundColor: "rgba(var(--foreground-rgb), 0.08)",
                color: "var(--foreground)",
              }}
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 transition-colors"
              style={{
                backgroundColor: "rgba(var(--foreground-rgb), 0.08)",
                color: "var(--foreground)",
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function SincronizacionPage() {
  return (
    <AdminPageContainer>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--foreground)" }}>
            Sincronización FTP
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(var(--foreground-rgb), 0.5)" }}>
            Monitoreo del proceso automático de integración con el sistema externo. Actualización automática cada 20 minutos.
          </p>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <StatsCards />

      {/* Tabla de corridas */}
      <TablaRuns />
    </AdminPageContainer>
  );
}
