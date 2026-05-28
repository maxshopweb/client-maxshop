"use client";

import { useMemo } from "react";
import type { IProductos } from "@/app/types/producto.type";
import { matchesSearch } from "@/app/utils/search.utils";

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

    return products.filter((product) => {
      const nombre = product.nombre || "";
      const descripcion = product.descripcion || "";
      const marca = product.marca?.nombre || "";
      const codiArti = product.codi_arti || "";
      const searchText = `${nombre} ${descripcion} ${marca} ${codiArti}`;

      if (caseSensitive) {
        return searchText.includes(query);
      }
      return matchesSearch(searchText, query);
    });
  }, [query, products, caseSensitive]);

  return {
    results: filteredProducts,
    hasResults: filteredProducts.length > 0,
    resultCount: filteredProducts.length,
  };
}


