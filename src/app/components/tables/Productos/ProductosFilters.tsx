import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useProductosFilters } from '@/app/hooks/productos/useProductFilter';
import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import type { ICategoria } from '@/app/types/categoria.type';
import type { IMarca } from '@/app/types/marca.type';

export function ProductosFilters() {
    const {
        filters,
        setFilter,
        clearFilters,
        hasActiveFilters,
        activeFiltersCount,
        categorias,
        subcategorias,
        marcas,
        loadingCategorias,
        loadingSubcategorias,
        loadingMarcas,
    } = useProductosFilters();

    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    return (
        <div className="bg-card border border-card p-4 rounded-lg shadow-lg space-y-4">
            {/* FILA SUPERIOR */}
            <div className="flex gap-3 items-start">
                {/* Input de búsqueda */}
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, SKU o descripción..."
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
                            {/* Animación de entrada */}
                            <style jsx>{`
                                @keyframes slideDown {
                                    from {
                                        opacity: 0;
                                        transform: translateY(-10px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }
                                
                                [data-state="open"] {
                                    animation: slideDown 200ms ease-out;
                                }
                            `}</style>

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

                            {/* CATEGORÍA */}
                            <div>
                                <Select
                                    label="Categoría"
                                    options={[
                                        { value: '', label: 'Todas las categorías' },
                                        ...(categorias?.map((cat: ICategoria) => ({
                                            value: cat.id_cat,
                                            label: cat.nombre || 'Sin nombre',
                                        })) || [])
                                    ]}
                                    value={filters.id_cat || ''}
                                    onChange={(value) => {
                                        setFilter('id_cat', value ? Number(value) : undefined);
                                        // Limpiar subcategoría al cambiar categoría
                                        if (filters.id_subcat) {
                                            setFilter('id_subcat', undefined);
                                        }
                                    }}
                                    disabled={loadingCategorias}
                                    placeholder={loadingCategorias ? "Cargando..." : "Seleccionar categoría"}
                                />
                            </div>

                            {/* SUBCATEGORÍA */}
                            {filters.id_cat && (
                                <div>
                                    <Select
                                        label="Subcategoría"
                                        options={[
                                            { value: '', label: 'Todas las subcategorías' },
                                            ...(subcategorias?.map((subcat: any) => ({
                                                value: subcat.id_subcat,
                                                label: subcat.nombre || 'Sin nombre',
                                            })) || [])
                                        ]}
                                        value={filters.id_subcat || ''}
                                        onChange={(value) => {
                                            setFilter('id_subcat', value ? Number(value) : undefined);
                                        }}
                                        disabled={loadingSubcategorias}
                                        placeholder={loadingSubcategorias ? "Cargando..." : "Seleccionar subcategoría"}
                                    />
                                </div>
                            )}

                            {/* MARCA */}
                            <div>
                                <Select
                                    label="Marca"
                                    options={[
                                        { value: '', label: 'Todas las marcas' },
                                        ...(marcas?.map((marca: IMarca) => ({
                                            value: marca.id_marca,
                                            label: marca.nombre || 'Sin nombre',
                                        })) || [])
                                    ]}
                                    value={filters.id_marca || ''}
                                    onChange={(value) => {
                                        setFilter('id_marca', value ? Number(value) : undefined);
                                    }}
                                    disabled={loadingMarcas}
                                    placeholder={loadingMarcas ? "Cargando..." : "Seleccionar marca"}
                                />
                            </div>

                            {/* RANGO DE PRECIOS */}
                            <div>
                                <label className="block text-sm font-medium text-input mb-1.5">
                                    Rango de Precios
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Mínimo"
                                        value={filters.precio_min || ''}
                                        onChange={(e) =>
                                            setFilter('precio_min', e.target.value ? Number(e.target.value) : undefined)
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Máximo"
                                        value={filters.precio_max || ''}
                                        onChange={(e) =>
                                            setFilter('precio_max', e.target.value ? Number(e.target.value) : undefined)
                                        }
                                    />
                                </div>
                            </div>

                            {/* ESTADO */}
                            <div>
                                <label className="block text-sm font-medium text-input mb-1.5">
                                    Estado
                                </label>
                                <select
                                    value={filters.estado !== undefined ? filters.estado.toString() : ''}
                                    onChange={(e) =>
                                        setFilter('estado', e.target.value ? Number(e.target.value) as 0 | 1 : undefined)
                                    }
                                    className="w-full px-3 py-2.5 bg-input border border-input rounded-2xl text-input text-sm focus:outline-none focus:ring-2 focus:ring-principal transition-all"
                                >
                                    <option value="">Todos</option>
                                    <option value="1">Activos</option>
                                    <option value="0">Inactivos</option>
                                </select>
                            </div>

                            {/* CHECKBOXES */}
                            <div className="space-y-2.5 pt-3 border-t border-card">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <Checkbox.Root
                                        checked={filters.destacado || false}
                                        onCheckedChange={(checked) =>
                                            setFilter('destacado', checked ? true : undefined)
                                        }
                                        className="flex h-5 w-5 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal transition-all"
                                    >
                                        <Checkbox.Indicator>
                                            <Check className="h-3.5 w-3.5 text-white" />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <span className="text-sm text-input group-hover:text-principal transition-colors">
                                        Solo productos destacados
                                    </span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <Checkbox.Root
                                        checked={filters.financiacion || false}
                                        onCheckedChange={(checked) =>
                                            setFilter('financiacion', checked ? true : undefined)
                                        }
                                        className="flex h-5 w-5 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal transition-all"
                                    >
                                        <Checkbox.Indicator>
                                            <Check className="h-3.5 w-3.5 text-white" />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <span className="text-sm text-input group-hover:text-principal transition-colors">
                                        Con financiación disponible
                                    </span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <Checkbox.Root
                                        checked={filters.stock_bajo || false}
                                        onCheckedChange={(checked) =>
                                            setFilter('stock_bajo', checked ? true : undefined)
                                        }
                                        className="flex h-5 w-5 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal transition-all"
                                    >
                                        <Checkbox.Indicator>
                                            <Check className="h-3.5 w-3.5 text-white" />
                                        </Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <span className="text-sm text-input group-hover:text-principal transition-colors">
                                        Solo productos con stock bajo
                                    </span>
                                </label>
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

                    {filters.id_cat && (
                        <FilterChip
                            label="Categoría seleccionada"
                            onRemove={() => setFilter('id_cat', undefined)}
                        />
                    )}

                    {filters.id_marca && (
                        <FilterChip
                            label="Marca seleccionada"
                            onRemove={() => setFilter('id_marca', undefined)}
                        />
                    )}

                    {(filters.precio_min || filters.precio_max) && (
                        <FilterChip
                            label={`Precio: ${filters.precio_min || '0'} - ${filters.precio_max || '∞'}`}
                            onRemove={() => {
                                setFilter('precio_min', undefined);
                                setFilter('precio_max', undefined);
                            }}
                        />
                    )}

                    {filters.destacado && (
                        <FilterChip
                            label="Destacados"
                            onRemove={() => setFilter('destacado', undefined)}
                        />
                    )}

                    {filters.financiacion && (
                        <FilterChip
                            label="Con financiación"
                            onRemove={() => setFilter('financiacion', undefined)}
                        />
                    )}

                    {filters.stock_bajo && (
                        <FilterChip
                            label="Stock bajo"
                            onRemove={() => setFilter('stock_bajo', undefined)}
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