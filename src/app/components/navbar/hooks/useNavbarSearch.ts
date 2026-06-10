"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const CATALOG_PATH_PREFIX = "/tienda/productos";
const PRODUCT_DETAIL_PATTERN = /^\/tienda\/productos\/\d+/;

function readSearchFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("search") || "";
}

function isCatalogPath(pathname: string | null): boolean {
  return !!pathname?.startsWith(CATALOG_PATH_PREFIX);
}

function isProductDetailPath(pathname: string | null): boolean {
  return !!pathname?.match(PRODUCT_DETAIL_PATTERN);
}

export function useNavbarSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // Sincronizar desde URL cuando estamos en catálogo o detalle de producto
  useEffect(() => {
    if (!isCatalogPath(pathname) && !isProductDetailPath(pathname)) return;

    const urlSearch = readSearchFromUrl();
    setSearchQuery((prev) => (prev !== urlSearch ? urlSearch : prev));
  }, [pathname]);

  // Re-sincronizar cuando la URL cambia en la misma ruta (filtros del sidebar)
  useEffect(() => {
    if (!isCatalogPath(pathname)) return;

    const syncFromUrl = () => {
      const urlSearch = readSearchFromUrl();
      setSearchQuery((prev) => (prev !== urlSearch ? urlSearch : prev));
    };

    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, [pathname]);

  // Limpiar al salir del flujo de catálogo/producto
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;

    const wasInSearchFlow =
      isCatalogPath(prevPathnameRef.current) ||
      isProductDetailPath(prevPathnameRef.current);
    const isInSearchFlow = isCatalogPath(pathname) || isProductDetailPath(pathname);

    if (wasInSearchFlow && !isInSearchFlow) {
      setSearchQuery("");
    } else if (isCatalogPath(pathname)) {
      const urlSearch = readSearchFromUrl();
      setSearchQuery(urlSearch);
    }

    prevPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      setSearchQuery("");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    searchQuery,
    setSearchQuery,
  };
}
