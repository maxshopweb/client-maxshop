'use client';

import { useCallback, useMemo, useState } from 'react';
import { FileSpreadsheet, Filter, Info } from 'lucide-react';
import { toast } from 'sonner';
import SimpleModal from '@/app/components/modals/SimpleModal';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import Select from '@/app/components/ui/Select';
import {
    ESTADO_PAGO_OPTIONS,
    ESTADO_ENVIO_OPTIONS,
    METODO_PAGO_OPTIONS,
    TIPO_VENTA_OPTIONS,
    type IVentaFilters,
} from '@/app/types/ventas.type';
import { useVentasFilters } from '@/app/hooks/ventas/useVentasFilters';
import { ventasService } from '@/app/services/venta.service';

export type IVentaExportFilters = Omit<IVentaFilters, 'page' | 'limit' | 'order_by' | 'order'>;

const EMPTY_EXPORT_FILTERS: IVentaExportFilters = {};

interface ExportarVentasModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function stripPaginationFilters(filters: IVentaFilters): IVentaExportFilters {
    const { page: _p, limit: _l, order_by: _o, order: _ord, ...rest } = filters;
    return rest;
}

function countExportFilters(filters: IVentaExportFilters): number {
    let n = 0;
    if (filters.busqueda) n++;
    if (filters.cod_interno) n++;
    if (filters.id_venta) n++;
    if (filters.fecha_desde) n++;
    if (filters.fecha_hasta) n++;
    if (filters.estado_pago) n++;
    if (filters.estado_envio) n++;
    if (filters.metodo_pago) n++;
    if (filters.tipo_venta) n++;
    if (filters.total_min !== undefined) n++;
    if (filters.total_max !== undefined) n++;
    if (filters.incluir_canceladas) n++;
    return n;
}

function buildFilterSummary(filters: IVentaExportFilters): string[] {
    const lines: string[] = [];
    if (filters.fecha_desde || filters.fecha_hasta) {
        lines.push(`Fechas: ${filters.fecha_desde || '…'} → ${filters.fecha_hasta || '…'}`);
    }
    if (filters.cod_interno) lines.push(`N° operación: ${filters.cod_interno}`);
    if (filters.busqueda) lines.push(`Cliente / búsqueda: ${filters.busqueda}`);
    if (filters.estado_pago) lines.push(`Estado pago: ${filters.estado_pago}`);
    if (filters.estado_envio) lines.push(`Estado envío: ${filters.estado_envio}`);
    if (filters.metodo_pago) lines.push(`Método pago: ${filters.metodo_pago}`);
    if (filters.tipo_venta) lines.push(`Tipo venta: ${filters.tipo_venta}`);
    if (filters.total_min !== undefined || filters.total_max !== undefined) {
        lines.push(`Total: ${filters.total_min ?? '…'} – ${filters.total_max ?? '…'}`);
    }
    if (filters.incluir_canceladas) lines.push('Incluye canceladas');
    return lines;
}

export function ExportarVentasModal({ isOpen, onClose }: ExportarVentasModalProps) {
    const { filters: tableFilters } = useVentasFilters();
    const [exportFilters, setExportFilters] = useState<IVentaExportFilters>(EMPTY_EXPORT_FILTERS);
    const [localTotalMin, setLocalTotalMin] = useState('');
    const [localTotalMax, setLocalTotalMax] = useState('');
    const [isExporting, setIsExporting] = useState(false);

    const activeCount = countExportFilters(exportFilters);
    const summary = useMemo(() => buildFilterSummary(exportFilters), [exportFilters]);

    const setField = useCallback(<K extends keyof IVentaExportFilters>(key: K, value: IVentaExportFilters[K]) => {
        setExportFilters((prev) => {
            const next = { ...prev };
            if (value === undefined || value === '' || value === null) {
                delete next[key];
            } else {
                next[key] = value;
            }
            return next;
        });
    }, []);

    const handleUseTableFilters = useCallback(() => {
        const stripped = stripPaginationFilters(tableFilters);
        setExportFilters(stripped);
        setLocalTotalMin(stripped.total_min !== undefined ? String(stripped.total_min) : '');
        setLocalTotalMax(stripped.total_max !== undefined ? String(stripped.total_max) : '');
        toast.message('Filtros de la tabla aplicados al export');
    }, [tableFilters]);

    const handleExport = useCallback(async () => {
        const payload: IVentaExportFilters = { ...exportFilters };
        if (localTotalMin !== '') {
            const n = Number(localTotalMin);
            if (Number.isFinite(n)) payload.total_min = n;
        } else {
            delete payload.total_min;
        }
        if (localTotalMax !== '') {
            const n = Number(localTotalMax);
            if (Number.isFinite(n)) payload.total_max = n;
        } else {
            delete payload.total_max;
        }

        setIsExporting(true);
        try {
            const blob = await ventasService.exportVentasExcel(payload);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Ventas-${new Date().toISOString().slice(0, 10)}.xlsx`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('Exportación iniciada', {
                description: activeCount === 0
                    ? 'Se exportaron todas las ventas no canceladas.'
                    : `Excel generado con ${activeCount} filtro(s) activo(s).`,
            });
            onClose();
        } catch (e) {
            toast.error('No se pudo exportar', {
                description: e instanceof Error ? e.message : 'Error desconocido.',
            });
        } finally {
            setIsExporting(false);
        }
    }, [exportFilters, localTotalMin, localTotalMax, activeCount, onClose]);

    return (
        <SimpleModal
            isOpen={isOpen}
            onClose={onClose}
            maxWidth="max-w-xl"
            title={
                <span className="flex items-center gap-2">
                    <FileSpreadsheet className="h-6 w-6 text-principal" />
                    Exportar Ventas
                </span>
            }
            actions={(handleClose) => (
                <>
                    <Button type="button" variant="outline-primary" onClick={handleClose} disabled={isExporting}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={handleExport} disabled={isExporting}>
                        {isExporting ? 'Generando…' : 'Descargar Excel'}
                    </Button>
                </>
            )}
        >
            <div className="space-y-5">
                <div className="flex items-start gap-2 rounded-md border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-foreground">
                    <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                    {activeCount === 0 ? (
                        <p>
                            Sin filtros activos: se exportarán <strong>todas las ventas excepto las canceladas</strong>,
                            con el mismo formato que el Excel del FTP.
                        </p>
                    ) : (
                        <p>
                            Se exportarán las ventas que coincidan con los filtros seleccionados
                            {!exportFilters.incluir_canceladas && ' (excluyendo canceladas)'}.
                        </p>
                    )}
                </div>

                <Button
                    type="button"
                    variant="outline-primary"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleUseTableFilters}
                >
                    <Filter className="h-4 w-4" />
                    Usar filtros actuales de la tabla
                </Button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        label="Fecha desde"
                        type="date"
                        value={exportFilters.fecha_desde || ''}
                        onChange={(e) => setField('fecha_desde', e.target.value || undefined)}
                    />
                    <Input
                        label="Fecha hasta"
                        type="date"
                        value={exportFilters.fecha_hasta || ''}
                        onChange={(e) => setField('fecha_hasta', e.target.value || undefined)}
                    />
                </div>

                <Input
                    label="N° de operación"
                    type="text"
                    placeholder="Ej: MAX-00001234"
                    value={exportFilters.cod_interno || ''}
                    onChange={(e) => setField('cod_interno', e.target.value || undefined)}
                />

                <Input
                    label="Cliente"
                    type="text"
                    placeholder="Nombre, email o documento"
                    value={exportFilters.busqueda || ''}
                    onChange={(e) => setField('busqueda', e.target.value || undefined)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                        label="Estado de pago"
                        options={[
                            { value: '', label: 'Todos' },
                            ...ESTADO_PAGO_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
                        ]}
                        value={exportFilters.estado_pago || ''}
                        onChange={(v) => setField('estado_pago', v ? (v as IVentaExportFilters['estado_pago']) : undefined)}
                        placeholder="Todos"
                    />
                    <Select
                        label="Estado de envío"
                        options={[
                            { value: '', label: 'Todos' },
                            ...ESTADO_ENVIO_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
                        ]}
                        value={exportFilters.estado_envio || ''}
                        onChange={(v) => setField('estado_envio', v ? (v as IVentaExportFilters['estado_envio']) : undefined)}
                        placeholder="Todos"
                    />
                    <Select
                        label="Método de pago"
                        options={[
                            { value: '', label: 'Todos' },
                            ...METODO_PAGO_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
                        ]}
                        value={exportFilters.metodo_pago || ''}
                        onChange={(v) => setField('metodo_pago', v ? (v as IVentaExportFilters['metodo_pago']) : undefined)}
                        placeholder="Todos"
                    />
                    <Select
                        label="Tipo de venta"
                        options={[
                            { value: '', label: 'Todos' },
                            ...TIPO_VENTA_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
                        ]}
                        value={exportFilters.tipo_venta || ''}
                        onChange={(v) => setField('tipo_venta', v ? (v as IVentaExportFilters['tipo_venta']) : undefined)}
                        placeholder="Todos"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-input mb-1.5">Rango de total</label>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            type="number"
                            placeholder="Mínimo"
                            value={localTotalMin}
                            onChange={(e) => setLocalTotalMin(e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="Máximo"
                            value={localTotalMax}
                            onChange={(e) => setLocalTotalMax(e.target.value)}
                        />
                    </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                        type="checkbox"
                        className="rounded border-input"
                        checked={exportFilters.incluir_canceladas === true}
                        onChange={(e) => setField('incluir_canceladas', e.target.checked ? true : undefined)}
                    />
                    Incluir ventas canceladas
                </label>

                {summary.length > 0 && (
                    <div className="rounded-md border border-card bg-input/30 p-3 space-y-1">
                        <p className="text-xs font-semibold text-input uppercase tracking-wide">Resumen de filtros</p>
                        <ul className="text-sm space-y-0.5 list-disc list-inside text-foreground/90">
                            {summary.map((line) => (
                                <li key={line}>{line}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </SimpleModal>
    );
}
