import { useMemo } from 'react';
import type { IProductos } from '@/app/types/producto.type';

export type SortOption = 'nombre_asc' | 'nombre_desc' | 'precio_asc' | 'precio_desc';

export function useProductSorting(
  productos: IProductos[],
  sort: SortOption
): IProductos[] {
  return useMemo(() => {
    if (!productos || productos.length === 0) return [];

    const sorted = [...productos].sort((a, b) => {
      switch (sort) {
        case 'nombre_asc':
          const nombreA = (a.nombre || '').toLowerCase();
          const nombreB = (b.nombre || '').toLowerCase();
          return nombreA.localeCompare(nombreB, 'es', { sensitivity: 'base' });

        case 'nombre_desc':
          const nombreADesc = (a.nombre || '').toLowerCase();
          const nombreBDesc = (b.nombre || '').toLowerCase();
          return -nombreADesc.localeCompare(nombreBDesc, 'es', { sensitivity: 'base' });

        case 'precio_asc':
          const precioA = a.precio || a.precio_minorista || 0;
          const precioB = b.precio || b.precio_minorista || 0;
          return precioA - precioB;

        case 'precio_desc':
          const precioADesc = a.precio || a.precio_minorista || 0;
          const precioBDesc = b.precio || b.precio_minorista || 0;
          return precioBDesc - precioADesc;

        default:
          return 0;
      }
    });

    return sorted;
  }, [productos, sort]);
}

