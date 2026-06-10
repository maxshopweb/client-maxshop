"use client";

import { useMemo } from "react";
import { useProductos } from "@/app/hooks/productos/useProductos";
import { isSearchQueryActive, trimSearchQuery } from "@/app/utils/catalog-search.utils";

const SUGGESTIONS_LIMIT = 6;

interface UseProductSearchSuggestionsOptions {
  query: string;
  enabled?: boolean;
}

/**
 * Sugerencias de búsqueda server-driven (mismo endpoint y criterio que el catálogo).
 */
export function useProductSearchSuggestions({
  query,
  enabled = true,
}: UseProductSearchSuggestionsOptions) {
  const trimmedQuery = trimSearchQuery(query);
  const isActive = enabled && isSearchQueryActive(trimmedQuery);

  const { productos, isLoading, isFetching } = useProductos({
    filters: {
      busqueda: trimmedQuery,
      limit: SUGGESTIONS_LIMIT,
      page: 1,
    },
    enabled: isActive,
    keepPreviousData: false,
    useTiendaEndpoint: true,
  });

  const results = useMemo(() => productos ?? [], [productos]);

  return {
    results,
    resultCount: results.length,
    hasResults: results.length > 0,
    isLoading: isActive && (isLoading || isFetching),
    trimmedQuery,
    isActive,
  };
}
