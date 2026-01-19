"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import FilterSelect from "@/app/components/ui/FilterSelect";
import { useProductFilters } from "@/app/hooks/productos/useProductFilters";

export type SortOption = 'nombre_asc' | 'nombre_desc' | 'precio_asc' | 'precio_desc';

interface ProductSortSelectorProps {
  className?: string;
}

export function ProductSortSelector({ className = "" }: ProductSortSelectorProps) {
  const searchParams = useSearchParams();
  const { sort, setSort } = useProductFilters();

  // Leer order_by y order desde URL, convertir a SortOption para el selector
  const orderBy = searchParams.get('order_by') || 'creado_en';
  const order = searchParams.get('order') || 'desc';
  
  const sortValue: SortOption = useMemo(() => {
    // Convertir order_by/order a SortOption
    if (orderBy === 'nombre') {
      return order === 'asc' ? 'nombre_asc' : 'nombre_desc';
    }
    if (orderBy === 'precio') {
      return order === 'asc' ? 'precio_asc' : 'precio_desc';
    }
    // Default: nombre ascendente
    return 'nombre_asc';
  }, [orderBy, order]);

  const sortOptions = [
    { value: 'nombre_asc', label: 'A - Z' },
    { value: 'nombre_desc', label: 'Z - A' },
    { value: 'precio_asc', label: 'Precio: menor a mayor' },
    { value: 'precio_desc', label: 'Precio: mayor a menor' },
  ];

  const handleSortChange = useCallback((value: string | number) => {
    // Convertir SortOption a order_by y order
    const sortStr = String(value) as SortOption;
    let newOrderBy: 'nombre' | 'precio' | 'creado_en' | 'stock' = 'creado_en';
    let newOrder: 'asc' | 'desc' = 'desc';
    
    switch (sortStr) {
      case 'nombre_asc':
        newOrderBy = 'nombre';
        newOrder = 'asc';
        break;
      case 'nombre_desc':
        newOrderBy = 'nombre';
        newOrder = 'desc';
        break;
      case 'precio_asc':
        newOrderBy = 'precio';
        newOrder = 'asc';
        break;
      case 'precio_desc':
        newOrderBy = 'precio';
        newOrder = 'desc';
        break;
    }
    
    // Usar setSort del hook (ya preserva todos los filtros automáticamente)
    // Si es el orden por defecto (creado_en desc), usar valores por defecto
    if (newOrderBy === 'creado_en' && newOrder === 'desc') {
      setSort('creado_en', 'desc');
    } else {
      setSort(newOrderBy, newOrder);
    }
  }, [setSort]);

  return (
    <div className={className}>
      <FilterSelect
        options={sortOptions}
        value={sortValue}
        onChange={handleSortChange}
        placeholder="Seleccionar..."
        label="Ordenar por"
        className="min-w-[200px]"
      />
    </div>
  );
}

