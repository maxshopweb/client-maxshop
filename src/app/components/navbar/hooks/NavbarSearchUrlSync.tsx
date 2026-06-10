"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface NavbarSearchUrlSyncProps {
  onSearchFromUrl: (query: string) => void;
}

/**
 * Sincroniza el input del navbar con `?search=` cuando la URL cambia vía router.replace (sidebar).
 * Debe renderizarse dentro de un boundary Suspense.
 */
export function NavbarSearchUrlSync({ onSearchFromUrl }: NavbarSearchUrlSyncProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const prevUrlSearchRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname?.startsWith("/tienda/productos")) {
      prevUrlSearchRef.current = null;
      return;
    }

    const urlSearch = searchParams.get("search") || "";
    if (prevUrlSearchRef.current === urlSearch) return;

    prevUrlSearchRef.current = urlSearch;
    onSearchFromUrl(urlSearch);
  }, [pathname, searchParams, onSearchFromUrl]);

  return null;
}
