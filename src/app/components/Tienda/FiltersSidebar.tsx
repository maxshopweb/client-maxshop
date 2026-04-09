"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { FiltersHeader } from "@/app/components/filters/sections/FiltersHeader";
import { FilterSearchInput } from "@/app/components/filters/sections/FilterSearchInput";
import { FilterPriceSection } from "@/app/components/filters/sections/FilterPriceSection";
import { FilterSelectSection } from "@/app/components/filters/sections/FilterSelectSection";
import { FilterCheckboxSection } from "@/app/components/filters/sections/FilterCheckboxSection";
import { useProductFilters } from "@/app/hooks/productos/useProductFilters";
import { useCategorias } from "@/app/hooks/categorias/useCategorias";
import { useMarcas } from "@/app/hooks/marcas/useMarcas";
import { useGrupos } from "@/app/hooks/grupos/useGrupos";
import type { ICategoria } from "@/app/types/categoria.type";
import type { IMarca } from "@/app/types/marca.type";
import type { IGrupo } from "@/app/types/grupo.type";
import type { IPaginatedResponse } from "@/app/types/producto.type";

const FALLBACK_PRICE_MAX = 100000;

const truncateLabel = (value: string, maxLength = 28) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3)}...`;
};

export interface FiltersSidebarProps {
  /** Min/max del catálogo según el API (`priceRange` de `/productos/tienda`). */
  catalogPriceRange?: IPaginatedResponse["priceRange"];
}

export default function FiltersSidebar({
  catalogPriceRange,
}: FiltersSidebarProps) {
  // Hook principal de filtros (URL como fuente de verdad)
  const {
    filters,
    setSearch,
    setPriceRange,
    setCategoria,
    setMarca,
    setGrupo,
    setDestacado,
    setOferta,
    clearFilters,
    hasActiveFilters,
    localSearch,
    localPriceRange,
  } = useProductFilters();

  // Obtener datos del backend
  const { data: categoriasResponse } = useCategorias();
  const { data: marcasResponse } = useMarcas();
  const { data: gruposResponse } = useGrupos();

  // Transformar datos a opciones para los selects
  const categoriasOptions = useMemo(
    () =>
      (categoriasResponse?.data || []).map((cat: ICategoria) => ({
        value: cat.codi_categoria,
        label: truncateLabel(cat.nombre || cat.codi_categoria),
      })),
    [categoriasResponse]
  );

  const marcasOptions = useMemo(
    () =>
      (marcasResponse?.data || []).map((marca: IMarca) => ({
        value: marca.codi_marca,
        label: truncateLabel(marca.nombre || marca.codi_marca),
      })),
    [marcasResponse]
  );

  const gruposOptions = useMemo(
    () =>
      (gruposResponse?.data || []).map((grupo: IGrupo) => ({
        value: grupo.codi_grupo,
        label: truncateLabel(grupo.nombre || grupo.codi_grupo),
      })),
    [gruposResponse]
  );

  // Enriquecer filters con labels para uso en logs o display
  const filtersWithLabels = useMemo(() => {
    const enriched = { ...filters };
    
    // Buscar y agregar label de categoría
    if (filters.categoria) {
      const categoriaOption = categoriasOptions.find((opt: { value: string; label: string }) => opt.value === filters.categoria);
      if (categoriaOption) {
        enriched.categoriaLabel = categoriaOption.label;
      }
    }
    
    // Buscar y agregar label de marca
    if (filters.marca) {
      const marcaOption = marcasOptions.find((opt: { value: string; label: string }) => opt.value === filters.marca);
      if (marcaOption) {
        enriched.marcaLabel = marcaOption.label;
      }
    }
    
    // Buscar y agregar label de grupo
    if (filters.grupo) {
      const grupoOption = gruposOptions.find((opt: { value: string; label: string }) => opt.value === filters.grupo);
      if (grupoOption) {
        enriched.grupoLabel = grupoOption.label;
      }
    }
    
    return enriched;
  }, [filters, categoriasOptions, marcasOptions, gruposOptions]);
  
  // Log para debugging (con labels)

  // Valores actuales de los filtros
  // Usar localSearch para el input (actualización inmediata y fluida)
  const searchValue = localSearch;
  const maxPrice =
    catalogPriceRange != null &&
    Number.isFinite(catalogPriceRange.max) &&
    catalogPriceRange.max > 0
      ? catalogPriceRange.max
      : FALLBACK_PRICE_MAX;

  // Usar localPriceRange para el slider (actualización inmediata), acotado al rango del catálogo
  const rawLow = localPriceRange[0] ?? 0;
  const rawHigh = localPriceRange[1] ?? maxPrice;
  let low = Math.max(0, Math.min(rawLow, maxPrice));
  let high = Math.max(0, Math.min(rawHigh, maxPrice));
  if (low > high) {
    low = high;
  }
  const priceRange: [number, number] = [low, high];

  // Handlers que actualizan la URL
  const onSearchChange = (value: string) => setSearch(value);
  const onPriceChange = (value: [number, number]) => {
    setPriceRange(value[0] === 0 ? undefined : value[0], value[1] === maxPrice ? undefined : value[1]);
  };
  const onCategoriaChange = (value: string | undefined) => setCategoria(value);
  const onMarcaChange = (value: string | undefined) => setMarca(value);
  const onGrupoChange = (value: string | undefined) => setGrupo(value);
  const onDestacadosChange = (checked: boolean) => setDestacado(checked);
  const onOfertasChange = (checked: boolean) => setOferta(checked);

  // Variantes de animación para el contenedor principal
  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const,
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
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.aside
      className="w-full lg:w-80 flex-shrink-0 bg-sidebar rounded-sm p-4 overflow-y-auto scrollbar-visible lg:sticky lg:top-28 lg:self-start"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="space-y-4" variants={containerVariants}>
        <FiltersHeader
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
        <FiltersHeader
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          showMobile={true}
        />

        <motion.div variants={itemVariants}>
          <FilterSearchInput value={searchValue} onChange={onSearchChange} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FilterPriceSection
            min={0}
            max={maxPrice}
            value={priceRange}
            onValueChange={onPriceChange}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="[&_h3]:text-sm [&_select]:text-xs">
          <FilterSelectSection
            title="Categorías"
            options={categoriasOptions}
            value={filters.categoria || undefined}
            placeholder="Seleccionar categoría"
            onChange={onCategoriaChange}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="[&_h3]:text-sm [&_select]:text-xs">
          <FilterSelectSection
            title="Marcas"
            options={marcasOptions}
            value={filters.marca || undefined}
            placeholder="Seleccionar marca"
            onChange={onMarcaChange}
          />
        </motion.div>

        <motion.div variants={itemVariants} className="[&_h3]:text-sm [&_select]:text-xs">
          <FilterSelectSection
            title="Grupos"
            options={gruposOptions}
            value={filters.grupo || undefined}
            placeholder="Seleccionar grupo"
            onChange={onGrupoChange}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <FilterCheckboxSection
            title="Filtros Adicionales"
            options={[
              {
                id: "destacados",
                label: "Destacados",
                checked: filters.destacado || false,
                onChange: onDestacadosChange,
              },
              {
                id: "ofertas",
                label: "Oferta",
                checked: filters.oferta || false,
                onChange: onOfertasChange,
              },
            ]}
          />
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}
