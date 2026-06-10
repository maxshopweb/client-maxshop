"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  buildCatalogSearchUrl,
  trimSearchQuery,
} from "@/app/utils/catalog-search.utils";

interface UseSearchSubmitOptions {
  onAfterNavigate?: () => void;
}

export function useSearchSubmit(options: UseSearchSubmitOptions = {}) {
  const router = useRouter();
  const { onAfterNavigate } = options;

  const submitSearch = useCallback(
    (query: string) => {
      const trimmed = trimSearchQuery(query);
      if (!trimmed) return false;

      router.push(buildCatalogSearchUrl(trimmed));
      onAfterNavigate?.();
      return true;
    },
    [router, onAfterNavigate]
  );

  return { submitSearch };
}
