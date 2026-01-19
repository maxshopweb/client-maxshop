"use client";

import { useMemo } from "react";
import type { IProductos } from "@/app/types/producto.type";

interface UseProductSearchOptions {
  query: string;
  products: IProductos[];
  caseSensitive?: boolean;
}

export function useProductSearch({
  query,
  products,
  caseSensitive = false,
}: UseProductSearchOptions) {
  const filteredProducts = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = caseSensitive ? query : query.toLowerCase();

    return products.filter((product) => {
      const nombre = product.nombre || "";
      const descripcion = product.descripcion || "";
      const marca = product.marca?.nombre || "";
      const codiArti = product.codi_arti || "";

      const searchText = caseSensitive
        ? `${nombre} ${descripcion} ${marca} ${codiArti}`
        : `${nombre} ${descripcion} ${marca} ${codiArti}`.toLowerCase();

      return searchText.includes(searchTerm);
    });
  }, [query, products, caseSensitive]);

  return {
    results: filteredProducts,
    hasResults: filteredProducts.length > 0,
    resultCount: filteredProducts.length,
  };
}


