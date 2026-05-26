'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock, FileText, RefreshCw, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/Button';
import { useFacturasEstadisticas } from '@/app/hooks/ventas/useFacturasEstadisticas';
import { facturasService } from '@/app/services/facturas.service';

export function FacturasPendientesCard() {
    const { estadisticas, isLoading, isError, refetch } = useFacturasEstadisticas();
    const [isSyncing, setIsSyncing] = useState(false);

    if (isLoading) {
        return (
            <div
                className="rounded-xl p-4 animate-pulse"
                style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.04)', border: '1px solid rgba(var(--foreground-rgb), 0.08)' }}
            >
                <div className="h-4 w-48 rounded mb-3" style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.1)' }} />
                <div className="h-8 w-full rounded" style={{ backgroundColor: 'rgba(var(--foreground-rgb), 0.1)' }} />
            </div>
        );
    }

    if (isError || !estadisticas) {
        return null;
    }

    const hasAlertas = estadisticas.pendientes > 0 || estadisticas.errores > 0;

    if (!hasAlertas && estadisticas.completados === 0 && estadisticas.total === 0) {
        return null;
    }

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const result = await facturasService.syncFacturas();
            toast.success('Sincronización completada', {
                description: `${result.procesadas} procesada(s), ${result.noEncontradas} no encontrada(s), ${result.errores} error(es).`,
            });
            await refetch();
        } catch (e) {
            toast.error('Error al sincronizar facturas', {
                description: e instanceof Error ? e.message : 'Error desconocido',
            });
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div
            className={`rounded-xl p-4 ${hasAlertas ? 'border border-amber-300 dark:border-amber-700' : ''}`}
            style={{
                backgroundColor: hasAlertas
                    ? 'rgba(245, 158, 11, 0.06)'
                    : 'rgba(var(--foreground-rgb), 0.04)',
                border: hasAlertas ? undefined : '1px solid rgba(var(--foreground-rgb), 0.08)',
            }}
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-principal/10 shrink-0">
                        <FileText className="w-5 h-5 text-principal" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                            Facturas pendientes
                            {hasAlertas && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                    <AlertTriangle size={11} />
                                    Requiere atención
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-foreground/60 mt-0.5">
                            Sync automática cada 30 min desde FTP. Podés forzar la sync o enviar facturas manualmente por venta.
                        </p>
                    </div>
                </div>

                {hasAlertas && (
                    <Button
                        type="button"
                        onClick={handleSync}
                        disabled={isSyncing}
                        variant="outline-primary"
                        className="flex items-center gap-2 shrink-0"
                    >
                        <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        {isSyncing ? 'Sincronizando...' : 'Sincronizar facturas ahora'}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-background/80 border border-input">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                        <p className="text-lg font-bold text-foreground leading-none">{estadisticas.pendientes}</p>
                        <p className="text-xs text-foreground/60 mt-0.5">Pendientes</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-background/80 border border-input">
                    <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <div>
                        <p className="text-lg font-bold text-foreground leading-none">{estadisticas.errores}</p>
                        <p className="text-xs text-foreground/60 mt-0.5">En error</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-2 bg-background/80 border border-input">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <div>
                        <p className="text-lg font-bold text-foreground leading-none">{estadisticas.completados}</p>
                        <p className="text-xs text-foreground/60 mt-0.5">Completadas</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
