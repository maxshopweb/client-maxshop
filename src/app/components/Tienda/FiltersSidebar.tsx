"use client";

import FilterSelect from "@/app/components/ui/FilterSelect";
import PriceSlider from "@/app/components/ui/PriceSlider";
import { Star, Sparkles, X } from "lucide-react";
import { useProductosFilters } from "@/app/hooks/productos/useProductFilter";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";

interface LocalFilters {
  busqueda?: string;
  precio_min?: number;
  precio_max?: number;
  id_cat?: number;
  id_marca?: number;
  codi_grupo?: string;
}

interface FiltersSidebarProps {
  localFilters?: LocalFilters;
  onFilterChange?: (filters: LocalFilters) => void;
}

export default function FiltersSidebar({ localFilters: externalFilters, onFilterChange }: FiltersSidebarProps = {}) {
  const {
    categorias,
    marcas,
    grupos,
  } = useProductosFilters();
  
  // Usar filtros externos si se proporcionan, sino usar estado local
  const [internalFilters, setInternalFilters] = useState<LocalFilters>(externalFilters || {});
  const filters = externalFilters !== undefined ? externalFilters : internalFilters;
  
  const updateFilters = (newFilters: LocalFilters) => {
    if (onFilterChange) {
      onFilterChange(newFilters);
    } else {
      setInternalFilters(newFilters);
    }
  };

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
  
  // Sincronizar filtros externos con estado interno
  useEffect(() => {
    if (externalFilters !== undefined) {
      setPriceRange([
        externalFilters.precio_min || 0,
        externalFilters.precio_max || 100000,
      ]);
    }
  }, [externalFilters]);

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
    updateFilters({
      ...filters,
      precio_min: value[0] > 0 ? value[0] : undefined,
      precio_max: value[1] < 100000 ? value[1] : undefined,
    });
  };

  // Manejar limpiar filtros (pero mantener destacados siempre activo)
  const handleClearFilters = () => {
    const clearedFilters: LocalFilters = {};
    updateFilters(clearedFilters);
    setPriceRange([0, 100000]);
  };

  // Destacados siempre activo - no se puede desmarcar
  // No hay handler porque siempre está marcado

  // Manejar ofertas (productos con precio < precio_minorista)
  const handleOfertasChange = (checked: boolean) => {
    // Por ahora no hay filtro específico para ofertas en el backend
    // Se puede implementar después
  };

  // Verificar si hay filtros activos (destacados no cuenta porque siempre está activo)
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.busqueda ||
      filters.precio_min ||
      filters.precio_max ||
      filters.id_cat ||
      filters.id_marca ||
      filters.codi_grupo
    );
  }, [filters]);

  // Variantes de animación para el contenedor principal
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  };

  // Variantes para los elementos hijos
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.aside
      className="w-full lg:w-80 flex-shrink-0 bg-sidebar rounded-lg p-4 overflow-y-auto scrollbar-visible lg:sticky lg:top-28 lg:self-start"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="space-y-4" variants={containerVariants}>
        {/* Header con botón limpiar - Solo en desktop */}
        <motion.div
          className="hidden lg:flex items-center justify-between mb-2"
          variants={itemVariants}
        >
          <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
          {hasActiveFilters && (
            <motion.button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-all duration-200 border border-transparent hover:border-destructive/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-3.5 h-3.5" />
              Limpiar
            </motion.button>
          )}
        </motion.div>

        {/* Botón limpiar en mobile */}
        {hasActiveFilters && (
          <motion.div
            className="lg:hidden flex justify-end mb-2"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 rounded-lg transition-all duration-200 border border-transparent hover:border-destructive/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-3.5 h-3.5" />
              Limpiar filtros
            </motion.button>
          </motion.div>
        )}

        {/* Búsqueda */}
        <motion.div className="space-y-2" variants={itemVariants}>
          <label className="text-sm font-medium text-foreground">Buscar Productos</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.busqueda || ""}
              onChange={(e) => updateFilters({
                ...filters,
                busqueda: e.target.value || undefined,
              })}
              className="w-full pl-4 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-principal/20 focus:border-principal transition-all"
            />
          </div>
        </motion.div>

        {/* Filtro por Precio */}
        <motion.div
          className="space-y-4 p-4 border border-input rounded-lg bg-card"
          variants={itemVariants}
        >
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Filtrar por Precio</h3>
          <PriceSlider
            min={0}
            max={100000}
            value={priceRange}
            onValueChange={handlePriceChange}
          />
        </motion.div>

        {/* Categorías */}
        <motion.div
          className="space-y-4 p-4 border border-input rounded-lg bg-card"
          variants={itemVariants}
        >
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Categorías</h3>
          <div className="space-y-2">
            <FilterSelect
              placeholder="Seleccionar categoría"
              options={categoriasLimitadas}
              value={filters.id_cat?.toString()}
              onChange={(value) => updateFilters({
                ...filters,
                id_cat: value ? Number(value) : undefined,
              })}
            />
          </div>
        </motion.div>

        {/* Marcas */}
        <motion.div
          className="space-y-4 p-4 border border-input rounded-lg bg-card"
          variants={itemVariants}
        >
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Marcas</h3>
          <div className="space-y-2">
            <FilterSelect
              placeholder="Seleccionar marca"
              options={marcasOptions}
              value={filters.id_marca?.toString()}
              onChange={(value) => updateFilters({
                ...filters,
                id_marca: value ? Number(value) : undefined,
              })}
            />
          </div>
        </motion.div>

        {/* Grupos */}
        {gruposOptions.length > 0 && (
          <motion.div
            className="space-y-4 p-4 border border-input rounded-lg bg-card"
            variants={itemVariants}
          >
            <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Grupos</h3>
            <div className="space-y-2">
              <FilterSelect
                placeholder="Seleccionar grupo"
                options={gruposOptions}
                value={filters.codi_grupo}
                onChange={(value) => updateFilters({
                  ...filters,
                  codi_grupo: value ? String(value) : undefined,
                })}
              />
            </div>
          </motion.div>
        )}

        {/* Filtros Adicionales */}
        <motion.div
          className="space-y-4 p-4 border border-input rounded-lg bg-card"
          variants={itemVariants}
        >
          <h3 className="text-base font-semibold text-foreground uppercase tracking-wide">Filtros Adicionales</h3>
          <div className="space-y-3">
            {/* Destacados - Siempre marcado y no se puede desmarcar */}
            <motion.div
              className="flex items-center gap-2 opacity-75"
              whileHover={{ opacity: 0.9 }}
            >
              <input
                type="checkbox"
                id="destacados"
                checked={true}
                disabled={true}
                readOnly
                className="w-4 h-4 rounded border-input text-principal focus:ring-2 focus:ring-principal/20 focus:ring-offset-0 cursor-not-allowed"
              />
              <label htmlFor="destacados" className="flex items-center gap-2 text-sm text-foreground cursor-not-allowed">
                <Star className="w-4 h-4 text-principal fill-principal" />
                <span>Productos destacados</span>
              </label>
            </motion.div>

            {/* Ofertas */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
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
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}

