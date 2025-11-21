"use client";

import FilterSelect from "@/app/components/ui/FilterSelect";
import PriceSlider from "@/app/components/ui/PriceSlider";
import { Star, Sparkles, X } from "lucide-react";
import { useProductosFilters } from "@/app/hooks/productos/useProductFilter";
import { useState, useMemo, useEffect } from "react";

export default function FiltersSidebar() {
  const {
    filters,
    setFilter,
    clearFilters,
    categorias,
    marcas,
    grupos,
  } = useProductosFilters();

  // Calcular precio máximo y mínimo para el slider
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.precio_min || 0,
    filters.precio_max || 100000,
  ]);

  // Sincronizar priceRange con filtros
  useEffect(() => {
    setPriceRange([
      filters.precio_min || 0,
      filters.precio_max || 100000,
    ]);
  }, [filters.precio_min, filters.precio_max]);

  // Categorías limitadas a 10
  const categoriasLimitadas = useMemo(() => {
    return categorias.slice(0, 10).map((cat) => ({
      value: cat.id_cat.toString(),
      label: cat.nombre || "Sin nombre",
    }));
  }, [categorias]);

  // Marcas para el select
  const marcasOptions = useMemo(() => {
    return marcas.map((marca) => ({
      value: marca.id_marca.toString(),
      label: marca.nombre || "Sin nombre",
    }));
  }, [marcas]);

  // Grupos para el select
  const gruposOptions = useMemo(() => {
    return grupos.map((grupo) => ({
      value: grupo.codi_grupo,
      label: grupo.nombre || grupo.codi_grupo || "Sin nombre",
    }));
  }, [grupos]);

  // Manejar cambio de precio
  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
    setFilter("precio_min", value[0] > 0 ? value[0] : undefined);
    setFilter("precio_max", value[1] < 100000 ? value[1] : undefined);
  };

  // Manejar limpiar filtros
  const handleClearFilters = () => {
    clearFilters();
    setPriceRange([0, 100000]);
  };

  // Manejar destacados
  const handleDestacadosChange = (checked: boolean) => {
    setFilter("destacado", checked || undefined);
  };

  // Manejar ofertas (productos con precio < precio_minorista)
  const handleOfertasChange = (checked: boolean) => {
    // Por ahora no hay filtro específico para ofertas en el backend
    // Se puede implementar después
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.busqueda ||
      filters.precio_min ||
      filters.precio_max ||
      filters.id_cat ||
      filters.id_marca ||
      filters.codi_grupo ||
      filters.destacado
    );
  }, [filters]);

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-sidebar rounded-lg p-4 overflow-y-auto scrollbar-visible lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-8rem)]">
      <div className="space-y-4">
        {/* Header con botón limpiar - Solo en desktop */}
        <div className="hidden lg:flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-all duration-200 border border-transparent hover:border-destructive/20"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar
            </button>
          )}
        </div>

        {/* Botón limpiar en mobile */}
        {hasActiveFilters && (
          <div className="lg:hidden flex justify-end mb-2">
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-all duration-200 border border-transparent hover:border-destructive/20"
            >
              <X className="w-3.5 h-3.5" />
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Búsqueda */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Buscar Productos</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.busqueda || ""}
              onChange={(e) => setFilter("busqueda", e.target.value || undefined)}
              className="w-full pl-4 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal transition-all"
            />
          </div>
        </div>

        {/* Filtro por Precio */}
        <div className="space-y-4 p-4 border border-input rounded-lg bg-card">
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Filtrar por Precio</h3>
          <PriceSlider
            min={0}
            max={100000}
            value={priceRange}
            onValueChange={handlePriceChange}
          />
        </div>

        {/* Categorías */}
        <div className="space-y-4 p-4 border border-input rounded-lg bg-card">
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Categorías</h3>
          <div className="space-y-2">
            <FilterSelect
              placeholder="Seleccionar categoría"
              options={categoriasLimitadas}
              value={filters.id_cat?.toString()}
              onChange={(value) => setFilter("id_cat", value ? Number(value) : undefined)}
            />
          </div>
        </div>

        {/* Marcas */}
        <div className="space-y-4 p-4 border border-input rounded-lg bg-card">
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Marcas</h3>
          <div className="space-y-2">
            <FilterSelect
              placeholder="Seleccionar marca"
              options={marcasOptions}
              value={filters.id_marca?.toString()}
              onChange={(value) => setFilter("id_marca", value ? Number(value) : undefined)}
            />
          </div>
        </div>

        {/* Grupos */}
        {gruposOptions.length > 0 && (
          <div className="space-y-4 p-4 border border-input rounded-lg bg-card">
            <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Grupos</h3>
            <div className="space-y-2">
              <FilterSelect
                placeholder="Seleccionar grupo"
                options={gruposOptions}
                value={filters.codi_grupo}
                onChange={(value) => setFilter("codi_grupo", value ? String(value) : undefined)}
              />
            </div>
          </div>
        )}

        {/* Filtros Adicionales */}
        <div className="space-y-4 p-4 border border-input rounded-lg bg-card">
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Filtros Adicionales</h3>
          <div className="space-y-3">
            {/* Destacados */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="destacados"
                checked={filters.destacado || false}
                onChange={(e) => handleDestacadosChange(e.target.checked)}
                className="w-4 h-4 rounded border-input text-principal focus:ring-2 focus:ring-principal/20 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="destacados" className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <Star className="w-4 h-4 text-principal fill-principal" />
                <span>Productos destacados</span>
              </label>
            </div>

            {/* Ofertas */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ofertas"
                onChange={(e) => handleOfertasChange(e.target.checked)}
                className="w-4 h-4 rounded border-input text-principal focus:ring-2 focus:ring-principal/20 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="ofertas" className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <Sparkles className="w-4 h-4 text-principal" />
                <span>Productos en oferta</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

