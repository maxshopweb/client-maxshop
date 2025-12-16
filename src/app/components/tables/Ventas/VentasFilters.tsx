import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useVentasFilters } from '@/app/hooks/ventas/useVentasFilters';
import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { ESTADO_PAGO_OPTIONS, ESTADO_ENVIO_OPTIONS, METODO_PAGO_OPTIONS, TIPO_VENTA_OPTIONS } from '@/app/types/ventas.type';

export function VentasFilters() {
    const {
        filters,
        setFilter,
        clearFilters,
        hasActiveFilters,
        activeFiltersCount,
    } = useVentasFilters();

    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    return (
        <div className="bg-card border border-card p-4 rounded-lg shadow-lg space-y-4">
            {/* FILA SUPERIOR */}
            <div className="flex gap-3 items-start">
                {/* Input de búsqueda */}
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Buscar por ID de venta, cliente..."
                        value={filters.busqueda || ''}
                        onChange={(e) => setFilter('busqueda', e.target.value)}
                        icon={Search}
                        iconPosition="left"
                    />
                </div>

                {/* Botón filtros avanzados */}
                <Popover.Root open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                    <Popover.Trigger asChild>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-input border border-input rounded-2xl text-sm font-medium text-input hover:bg-input/80 transition-all duration-200 hover:scale-105 whitespace-nowrap">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filtros
                            {activeFiltersCount > 0 && (
                                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-principal rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                        <Popover.Content
                            className="w-[calc(100vw-2rem)] max-w-md bg-card rounded-lg shadow-xl border border-card p-4 space-y-3 z-50 max-h-[calc(100vh-8rem)] overflow-y-auto"
                            align="end"
                            sideOffset={8}
                            side="top"
                            alignOffset={-8}
                            collisionPadding={16}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-input">
                                    Filtros Avanzados
                                </h3>
                                {hasActiveFilters && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-principal hover:text-principal/80 font-medium transition-colors"
                                    >
                                        Limpiar todo
                                    </button>
                                )}
                            </div>

                            {/* ESTADO DE PAGO */}
                            <div>
                                <Select
                                    label="Estado de Pago"
                                    options={[
                                        { value: '', label: 'Todos los estados' },
                                        ...ESTADO_PAGO_OPTIONS.map(opt => ({
                                            value: opt.value,
                                            label: opt.label,
                                        }))
                                    ]}
                                    value={filters.estado_pago || ''}
                                    onChange={(value) => {
                                        setFilter('estado_pago', value ? value as any : undefined);
                                    }}
                                    placeholder="Seleccionar estado"
                                />
                            </div>

                            {/* ESTADO DE ENVÍO */}
                            <div>
                                <Select
                                    label="Estado de Envío"
                                    options={[
                                        { value: '', label: 'Todos los estados' },
                                        ...ESTADO_ENVIO_OPTIONS.map(opt => ({
                                            value: opt.value,
                                            label: opt.label,
                                        }))
                                    ]}
                                    value={filters.estado_envio || ''}
                                    onChange={(value) => {
                                        setFilter('estado_envio', value ? value as any : undefined);
                                    }}
                                    placeholder="Seleccionar estado"
                                />
                            </div>

                            {/* MÉTODO DE PAGO */}
                            <div>
                                <Select
                                    label="Método de Pago"
                                    options={[
                                        { value: '', label: 'Todos los métodos' },
                                        ...METODO_PAGO_OPTIONS.map(opt => ({
                                            value: opt.value,
                                            label: opt.label,
                                        }))
                                    ]}
                                    value={filters.metodo_pago || ''}
                                    onChange={(value) => {
                                        setFilter('metodo_pago', value ? value as any : undefined);
                                    }}
                                    placeholder="Seleccionar método"
                                />
                            </div>

                            {/* TIPO DE VENTA */}
                            <div>
                                <Select
                                    label="Tipo de Venta"
                                    options={[
                                        { value: '', label: 'Todos los tipos' },
                                        ...TIPO_VENTA_OPTIONS.map(opt => ({
                                            value: opt.value,
                                            label: opt.label,
                                        }))
                                    ]}
                                    value={filters.tipo_venta || ''}
                                    onChange={(value) => {
                                        setFilter('tipo_venta', value ? value as any : undefined);
                                    }}
                                    placeholder="Seleccionar tipo"
                                />
                            </div>

                            {/* RANGO DE FECHAS */}
                            <div>
                                <label className="block text-sm font-medium text-input mb-1.5">
                                    Rango de Fechas
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="date"
                                        placeholder="Desde"
                                        value={filters.fecha_desde || ''}
                                        onChange={(e) =>
                                            setFilter('fecha_desde', e.target.value || undefined)
                                        }
                                    />
                                    <Input
                                        type="date"
                                        placeholder="Hasta"
                                        value={filters.fecha_hasta || ''}
                                        onChange={(e) =>
                                            setFilter('fecha_hasta', e.target.value || undefined)
                                        }
                                    />
                                </div>
                            </div>

                            {/* RANGO DE TOTALES */}
                            <div>
                                <label className="block text-sm font-medium text-input mb-1.5">
                                    Rango de Totales
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Mínimo"
                                        value={filters.total_min || ''}
                                        onChange={(e) =>
                                            setFilter('total_min', e.target.value ? Number(e.target.value) : undefined)
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Máximo"
                                        value={filters.total_max || ''}
                                        onChange={(e) =>
                                            setFilter('total_max', e.target.value ? Number(e.target.value) : undefined)
                                        }
                                    />
                                </div>
                            </div>

                            <Popover.Arrow className="fill-[var(--card-bg)]" />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {/* Botón limpiar */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-500/20 transition-all duration-200 hover:scale-105 whitespace-nowrap"
                    >
                        <X className="h-4 w-4" />
                        Limpiar
                    </button>
                )}
            </div>

            {/* CHIPS DE FILTROS ACTIVOS */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-card">
                    <span className="text-xs font-medium text-[var(--input-placeholder)]">
                        Filtros activos:
                    </span>

                    {filters.busqueda && (
                        <FilterChip
                            label={`Búsqueda: "${filters.busqueda}"`}
                            onRemove={() => setFilter('busqueda', undefined)}
                        />
                    )}

                    {filters.estado_pago && (
                        <FilterChip
                            label={`Pago: ${filters.estado_pago}`}
                            onRemove={() => setFilter('estado_pago', undefined)}
                        />
                    )}

                    {filters.estado_envio && (
                        <FilterChip
                            label={`Envío: ${filters.estado_envio}`}
                            onRemove={() => setFilter('estado_envio', undefined)}
                        />
                    )}

                    {filters.metodo_pago && (
                        <FilterChip
                            label={`Método: ${filters.metodo_pago}`}
                            onRemove={() => setFilter('metodo_pago', undefined)}
                        />
                    )}

                    {filters.tipo_venta && (
                        <FilterChip
                            label={`Tipo: ${filters.tipo_venta}`}
                            onRemove={() => setFilter('tipo_venta', undefined)}
                        />
                    )}

                    {(filters.fecha_desde || filters.fecha_hasta) && (
                        <FilterChip
                            label={`Fecha: ${filters.fecha_desde || '...'} - ${filters.fecha_hasta || '...'}`}
                            onRemove={() => {
                                setFilter('fecha_desde', undefined);
                                setFilter('fecha_hasta', undefined);
                            }}
                        />
                    )}

                    {(filters.total_min || filters.total_max) && (
                        <FilterChip
                            label={`Total: ${filters.total_min || '0'} - ${filters.total_max || '∞'}`}
                            onRemove={() => {
                                setFilter('total_min', undefined);
                                setFilter('total_max', undefined);
                            }}
                        />
                    )}
                </div>
            )}
        </div>
    );
}

// FilterChip
interface FilterChipProps {
    label: string;
    onRemove: () => void;
}

function FilterChip({ label, onRemove }: FilterChipProps) {
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-principal/20 text-principal text-xs font-medium rounded-full border border-principal/30 hover:bg-principal/30 transition-all duration-200">
            {label}
            <button
                onClick={onRemove}
                className="hover:bg-principal/40 rounded-full p-0.5 transition-colors"
            >
                <X className="h-3 w-3" />
            </button>
        </span>
    );
}

