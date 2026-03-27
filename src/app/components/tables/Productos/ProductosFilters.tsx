import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useProductFilters } from '@/app/hooks/productos/useProductFilters';
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
        localSearch,
        localPriceRange,
        categorias,
        marcas,
        grupos,
        loadingCategorias,
        loadingMarcas,
        loadingGrupos,
    } = useProductFilters();

    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Helper para encontrar el valor correcto de categoría/marca (priorizar código sobre ID)
    const findCategoryValue = (cat: ICategoria) => {
        // Siempre usar código si existe, sino usar ID
        return String(cat.codi_categoria || cat.id_cat || '');
    };

    const findMarcaValue = (marca: IMarca) => {
        // Siempre usar código si existe, sino usar ID
        return String(marca.codi_marca || marca.id_marca || '');
    };

    // Helper para normalizar el valor del filtro para que coincida con las opciones
    const normalizeFilterValue = (
        filterValue: string | number | undefined, 
        items: any[], 
        getValue: (item: any) => string,
        getAlternateValue?: (item: any) => string | number | undefined
    ) => {
        if (!filterValue) {
            return '';
        }
        
        const filterStr = String(filterValue);
        
        // Buscar el item que coincida (por código o ID)
        const found = items?.find((item) => {
            const itemValue = getValue(item);
            const alternateValue = getAlternateValue ? String(getAlternateValue(item) || '') : '';
            
            // Comparar con el valor principal (código) o con el valor alternativo (ID)
            return itemValue === filterStr || alternateValue === filterStr;
        });
        
        // Si lo encontramos, devolver su valor normalizado (siempre usar el código como valor principal)
        return found ? getValue(found) : filterStr;
    };

    // Helper para encontrar categoría/marca seleccionada (por código O por ID)
    const findSelectedCategory = () => {
        if (!filters.id_cat) return null;
        const idCatStr = String(filters.id_cat);
        
        return categorias?.find((cat: ICategoria) => {
            const codiMatch = String(cat.codi_categoria || '') === idCatStr;
            const idMatch = String(cat.id_cat || '') === idCatStr;
            return codiMatch || idMatch;
        }) || null;
    };

    const findSelectedMarca = () => {
        if (!filters.id_marca) return null;
        const idMarcaStr = String(filters.id_marca);
        
        return marcas?.find((marca: IMarca) => {
            const codiMatch = String(marca.codi_marca || '') === idMarcaStr;
            const idMatch = String(marca.id_marca || '') === idMarcaStr;
            return codiMatch || idMatch;
        }) || null;
    };

    // Grupo: comparar ignorando ceros a la izquierda para que "3" y "03" coincidan
    const findSelectedGrupo = () => {
        if (!filters.codi_grupo && filters.grupo === undefined) return null;
        const raw = String(filters.codi_grupo ?? filters.grupo ?? '').trim();
        if (!raw) return null;
        const normalized = raw.replace(/^0+/, '') || '0';
        return grupos?.find((g: { codi_grupo?: string }) =>
            String(g.codi_grupo || '').trim().replace(/^0+/, '') === normalized
        ) || null;
    };

    const normalizedGrupoValue = findSelectedGrupo() ? String(findSelectedGrupo()!.codi_grupo || '') : (filters.codi_grupo || filters.grupo ? String(filters.codi_grupo ?? filters.grupo) : '');

    // Normalizar valores para que coincidan con las opciones
    const normalizedCategoryValue = normalizeFilterValue(
        filters.id_cat,
        categorias || [],
        (cat) => findCategoryValue(cat),
        (cat) => cat.id_cat // Valor alternativo: ID numérico
    );

    const normalizedMarcaValue = normalizeFilterValue(
        filters.id_marca,
        marcas || [],
        (marca) => findMarcaValue(marca), // Valor principal: código (ej: '048')
        (marca) => marca.id_marca // Valor alternativo: ID numérico (ej: 48)
    );


    return (
        <div className="bg-card border border-card p-4 rounded-lg shadow-lg space-y-4">
            {/* FILA SUPERIOR */}
            <div className="flex gap-3 items-start">
                {/* Input de búsqueda */}
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Buscar por nombre, código, ID, SKU o descripción..."
                        value={localSearch}
                        onChange={(e) => setFilter('busqueda', e.target.value)}
                        icon={Search}
                        iconPosition="left"
                    />
                </div>

                {/* Botón filtros avanzados */}
                <Popover.Root open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
                    <Popover.Trigger asChild>
                        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-input border border-input rounded-sm text-sm font-medium text-input hover:bg-input/80 transition-all duration-200 hover:scale-105 whitespace-nowrap">
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

                            {/* CATEGORÍA */}
                            <div>
                                {(() => {
                                    const categoriaOptions = [
                                        { value: '', label: 'Todas las categorías' },
                                        ...(categorias?.map((cat: ICategoria) => ({
                                            value: findCategoryValue(cat),
                                            label: cat.nombre || 'Sin nombre',
                                        })) || [])
                                    ];
                                    
                                    return (
                                        <Select
                                            label="Categoría"
                                            options={categoriaOptions}
                                            value={normalizedCategoryValue}
                                            onChange={(value) => {
                                                setFilter('id_cat', value ? String(value) : undefined);
                                            }}
                                            disabled={loadingCategorias}
                                            placeholder={loadingCategorias ? "Cargando..." : "Seleccionar categoría"}
                                        />
                                    );
                                })()}
                            </div>

                            {/* GRUPO */}
                            <div>
                                <Select
                                    label="Grupo"
                                    preserveString
                                    options={[
                                        { value: '', label: 'Todos los grupos' },
                                        ...(grupos?.map((g: { codi_grupo?: string; nombre?: string }) => ({
                                            value: String(g.codi_grupo || ''),
                                            label: g.nombre || g.codi_grupo || 'Sin nombre',
                                        })) || [])
                                    ]}
                                    value={normalizedGrupoValue}
                                    onChange={(value) => setFilter('codi_grupo', value !== '' && value != null ? String(value) : undefined)}
                                    disabled={loadingGrupos}
                                    placeholder={loadingGrupos ? "Cargando..." : "Seleccionar grupo"}
                                />
                            </div>

                            {/* MARCA */}
                            <div>
                                {(() => {
                                    const marcaOptions = [
                                        { value: '', label: 'Todas las marcas' },
                                        ...(marcas?.map((marca: IMarca) => ({
                                            value: findMarcaValue(marca),
                                            label: marca.nombre || 'Sin nombre',
                                        })) || [])
                                    ];
                                    
                                    return (
                                        <Select
                                            label="Marca"
                                            options={marcaOptions}
                                            value={normalizedMarcaValue}
                                            onChange={(value) => {
                                                // El backend acepta códigos o IDs
                                                setFilter('id_marca', value ? String(value) : undefined);
                                            }}
                                            disabled={loadingMarcas}
                                            placeholder={loadingMarcas ? "Cargando..." : "Seleccionar marca"}
                                        />
                                    );
                                })()}
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
                                        value={localPriceRange[0] || ''}
                                        onChange={(e) =>
                                            setFilter('precio_min', e.target.value ? Number(e.target.value) : undefined)
                                        }
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Máximo"
                                        value={localPriceRange[1] || ''}
                                        onChange={(e) =>
                                            setFilter('precio_max', e.target.value ? Number(e.target.value) : undefined)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Estado del producto (Activo / Inactivo) */}
                            <div>
                                <label className="block text-sm font-medium text-input mb-1.5">
                                    Estado del producto
                                </label>
                                <select
                                    value={filters.estado ?? ''}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setFilter('estado', v ? (Number(v) as 1 | 2) : undefined);
                                    }}
                                    className="w-full px-3 py-2.5 bg-input border border-input rounded-sm text-input text-sm focus:outline-none focus:ring-2 focus:ring-principal transition-all"
                                >
                                    <option value="">Todos</option>
                                    <option value="1">Activo</option>
                                    <option value="2">Inactivo</option>
                                </select>
                            </div>

                            {/* Publicado en tienda (Sí / No) */}
                            <div>
                                <label className="block text-sm font-medium text-input mb-1.5">
                                    Publicado en tienda
                                </label>
                                <select
                                    value={filters.publicado === undefined ? '' : String(filters.publicado)}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setFilter('publicado', v === '' ? undefined : v === 'true');
                                    }}
                                    className="w-full px-3 py-2.5 bg-input border border-input rounded-sm text-input text-sm focus:outline-none focus:ring-2 focus:ring-principal transition-all"
                                >
                                    <option value="">Todos</option>
                                    <option value="true">Publicado</option>
                                    <option value="false">No publicado</option>
                                </select>
                            </div>

                            {/* CHECKBOXES — leer destacado/oferta/stock_bajo de filters (compatible con URL y backend) */}
                            {(() => {
                                const isDestacado = filters.destacado === true;
                                const isOferta = filters.oferta === true;
                                const isStockBajo =
                                    filters.stock_bajo === true || filters.stockBajo === true;
                                return (
                                    <div className="space-y-2.5 pt-3 border-t border-card">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <Checkbox.Root
                                                checked={isDestacado}
                                                onCheckedChange={(checked) =>
                                                    setFilter('destacado', checked === true ? true : undefined)
                                                }
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal data-[state=checked]:text-white transition-all"
                                            >
                                                <Checkbox.Indicator className="flex items-center justify-center text-white">
                                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                            <span className="text-sm text-input group-hover:text-principal transition-colors">
                                                Solo productos destacados
                                            </span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <Checkbox.Root
                                                checked={isOferta}
                                                onCheckedChange={(checked) =>
                                                    setFilter('oferta', checked === true ? true : undefined)
                                                }
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal data-[state=checked]:text-white transition-all"
                                            >
                                                <Checkbox.Indicator className="flex items-center justify-center text-white">
                                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                            <span className="text-sm text-input group-hover:text-principal transition-colors">
                                                Solo productos en oferta
                                            </span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <Checkbox.Root
                                                checked={isStockBajo}
                                                onCheckedChange={(checked) =>
                                                    setFilter('stock_bajo', checked === true ? true : undefined)
                                                }
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-input group-hover:border-principal data-[state=checked]:bg-principal data-[state=checked]:border-principal data-[state=checked]:text-white transition-all"
                                            >
                                                <Checkbox.Indicator className="flex items-center justify-center text-white">
                                                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                                                </Checkbox.Indicator>
                                            </Checkbox.Root>
                                            <span className="text-sm text-input group-hover:text-principal transition-colors">
                                                Solo productos con stock bajo
                                            </span>
                                        </label>
                                    </div>
                                );
                            })()}

                            <Popover.Arrow className="fill-[var(--card-bg)]" />
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {/* Botón limpiar */}
                {hasActiveFilters && (
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border-2 border-red-500/30 rounded-sm text-sm font-medium text-red-500 hover:bg-red-500/20 transition-all duration-200 hover:scale-105 whitespace-nowrap"
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

                    {filters.id_cat && (() => {
                        const categoriaSeleccionada = findSelectedCategory();
                        return (
                            <FilterChip
                                key="categoria-chip"
                                label={`Categoría: ${categoriaSeleccionada?.nombre || filters.id_cat}`}
                                onRemove={() => setFilter('id_cat', undefined)}
                            />
                        );
                    })()}

                    {(filters.codi_grupo || filters.grupo) && (() => {
                        const grupoSeleccionado = findSelectedGrupo();
                        return (
                            <FilterChip
                                key="grupo-chip"
                                label={`Grupo: ${grupoSeleccionado?.nombre ?? filters.codi_grupo ?? filters.grupo}`}
                                onRemove={() => setFilter('codi_grupo', undefined)}
                            />
                        );
                    })()}

                    {filters.id_marca && (() => {
                        const marcaSeleccionada = findSelectedMarca();
                        return (
                            <FilterChip
                                key="marca-chip"
                                label={`Marca: ${marcaSeleccionada?.nombre || filters.id_marca}`}
                                onRemove={() => setFilter('id_marca', undefined)}
                            />
                        );
                    })()}

                    {(filters.precio_min || filters.precio_max) && (
                        <FilterChip
                            label={`Precio: ${filters.precio_min || '0'} - ${filters.precio_max || '∞'}`}
                            onRemove={() => {
                                setFilter('precio_min', undefined);
                                setFilter('precio_max', undefined);
                            }}
                        />
                    )}

                    {filters.destacado === true && (
                        <FilterChip
                            label="Destacados"
                            onRemove={() => setFilter('destacado', undefined)}
                        />
                    )}

                    {filters.oferta === true && (
                        <FilterChip
                            label="En oferta"
                            onRemove={() => setFilter('oferta', undefined)}
                        />
                    )}

                    {(filters.stock_bajo === true || filters.stockBajo === true) && (
                        <FilterChip
                            label="Stock bajo"
                            onRemove={() => setFilter('stock_bajo', undefined)}
                        />
                    )}

                    {filters.estado !== undefined && (
                        <FilterChip
                            label={`Estado: ${filters.estado === 1 ? 'Activo' : 'Inactivo'}`}
                            onRemove={() => setFilter('estado', undefined)}
                        />
                    )}

                    {filters.publicado !== undefined && (
                        <FilterChip
                            label={filters.publicado ? 'Publicado' : 'No publicado'}
                            onRemove={() => setFilter('publicado', undefined)}
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