import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useClientesFilters } from '@/app/hooks/clientes/useClientesFilters';
import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import { CLIENTE_ORDEN_OPTIONS, CLIENTE_LIMIT_OPTIONS } from '@/app/types/cliente.type';
import { EstadoGeneral } from '@/app/types/estados.type';

const ESTADO_OPTIONS = [
    { value: '', label: 'Todos los estados' },
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
    { value: '0', label: 'Eliminado' },
];

export function ClientesFilters() {
    const {
        filters,
        setFilter,
        clearFilters,
        hasActiveFilters,
        activeFiltersCount,
        localBusqueda,
    } = useClientesFilters();

    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    return (
        <div className="bg-card border border-card p-4 rounded-lg shadow-lg space-y-4">
            {/* FILA SUPERIOR */}
            <div className="flex gap-3 items-start">
                {/* Input de búsqueda */}
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, email, teléfono..."
                        value={localBusqueda || ''}
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
                                    Filtros avanzados
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

                            {/* ESTADO */}
                            <div>
                                <Select
                                    label="Estado"
                                    options={ESTADO_OPTIONS}
                                    value={filters.estado?.toString() || ''}
                                    onChange={(value) => {
                                        setFilter('estado', value ? (Number(value) as EstadoGeneral) : undefined);
                                    }}
                                    placeholder="Seleccionar estado"
                                />
                            </div>

                            {/* CIUDAD */}
                            <div>
                                <Input
                                    label="Ciudad"
                                    placeholder="Filtrar por ciudad"
                                    value={filters.ciudad || ''}
                                    onChange={(e) => setFilter('ciudad', e.target.value || undefined)}
                                />
                            </div>

                            {/* PROVINCIA */}
                            <div>
                                <Input
                                    label="Provincia"
                                    placeholder="Filtrar por provincia"
                                    value={filters.provincia || ''}
                                    onChange={(e) => setFilter('provincia', e.target.value || undefined)}
                                />
                            </div>

                            {/* ORDENAMIENTO */}
                            <div>
                                <Select
                                    label="Ordenar por"
                                    options={CLIENTE_ORDEN_OPTIONS.map(opt => ({
                                        value: opt.value,
                                        label: opt.label,
                                    }))}
                                    value={filters.order_by || 'creado_en'}
                                    onChange={(value) => setFilter('order_by', value as any)}
                                />
                            </div>

                            <div>
                                <Select
                                    label="Orden"
                                    options={[
                                        { value: 'desc', label: 'Descendente' },
                                        { value: 'asc', label: 'Ascendente' },
                                    ]}
                                    value={filters.order || 'desc'}
                                    onChange={(value) => setFilter('order', value as 'asc' | 'desc')}
                                />
                            </div>

                            {/* LÍMITE POR PÁGINA */}
                            <div>
                                <Select
                                    label="Resultados por página"
                                    options={CLIENTE_LIMIT_OPTIONS.map(opt => ({
                                        value: opt.value.toString(),
                                        label: opt.label,
                                    }))}
                                    value={filters.limit?.toString() || '25'}
                                    onChange={(value) => setFilter('limit', Number(value))}
                                />
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {/* Botón limpiar filtros */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-100 transition-all duration-200 whitespace-nowrap"
                    >
                        <X className="h-4 w-4" />
                        Limpiar
                    </button>
                )}
            </div>
        </div>
    );
}

