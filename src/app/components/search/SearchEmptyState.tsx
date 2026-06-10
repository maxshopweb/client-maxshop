"use client";

import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";
import {
  buildCatalogBaseUrl,
  buildCatalogSearchUrl,
} from "@/app/utils/catalog-search.utils";

export type SearchEmptyReason = "search" | "filters";

interface SearchEmptyStateProps {
  searchQuery?: string;
  reason?: SearchEmptyReason;
  variant?: "dropdown" | "page";
  onClearSearch?: () => void;
  onViewCatalog?: () => void;
  /** Navega al catálogo con el término actual (CTA principal en dropdown). */
  onSearchInCatalog?: () => void;
  onClose?: () => void;
}

export default function SearchEmptyState({
  searchQuery = "",
  reason = "search",
  variant = "page",
  onClearSearch,
  onViewCatalog,
  onSearchInCatalog,
  onClose,
}: SearchEmptyStateProps) {
  const trimmedQuery = searchQuery.trim();
  const isSearchReason = reason === "search" && trimmedQuery.length > 0;
  const isDropdown = variant === "dropdown";

  const title = isSearchReason
    ? `No encontramos productos para "${trimmedQuery}"`
    : "No se encontraron productos con los filtros aplicados";

  const description = isSearchReason
    ? "Probá con otro término, revisá la ortografía o explorá el catálogo completo."
    : "Ajustá o quitá algunos filtros para ver más resultados.";

  const catalogSearchHref = buildCatalogSearchUrl(trimmedQuery);
  const catalogBaseHref = buildCatalogBaseUrl();

  const containerClass = isDropdown
    ? "py-6 px-4 text-center"
    : "text-center py-16 px-6 bg-gray-50 rounded-xl border border-gray-100";

  const iconSize = isDropdown ? "w-8 h-8" : "w-12 h-12";
  const titleClass = isDropdown
    ? "text-sm font-medium text-gray-700"
    : "text-xl font-semibold text-foreground";
  const descClass = isDropdown
    ? "text-xs text-gray-500 mt-1"
    : "text-sm text-foreground/60 mt-2 max-w-md mx-auto";

  return (
    <div
      className={containerClass}
      role="status"
      aria-live="polite"
    >
      <div className="flex justify-center mb-3">
        <SearchX className={`${iconSize} text-foreground/30`} aria-hidden />
      </div>

      <p className={titleClass}>{title}</p>
      <p className={descClass}>{description}</p>

      <div
        className={`flex flex-col sm:flex-row items-center justify-center gap-2 ${
          isDropdown ? "mt-4" : "mt-6"
        }`}
      >
        {isSearchReason && (
          onClearSearch ? (
            <button
              type="button"
              onClick={onClearSearch}
              className={
                isDropdown
                  ? "text-sm text-principal hover:text-principal/80 font-medium"
                  : "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-lg hover:bg-gray-100 transition-colors"
              }
            >
              Limpiar búsqueda
            </button>
          ) : (
            <Link
              href={catalogBaseHref}
              onClick={onClose}
              className={
                isDropdown
                  ? "text-sm text-principal hover:text-principal/80 font-medium"
                  : "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground border border-input rounded-lg hover:bg-gray-100 transition-colors"
              }
            >
              Limpiar búsqueda
            </Link>
          )
        )}

        {isSearchReason && isDropdown && (
          onSearchInCatalog ? (
            <button
              type="button"
              onClick={onSearchInCatalog}
              className="inline-flex items-center gap-1 text-sm font-medium text-white bg-principal px-3 py-1.5 rounded-md hover:bg-principal/90 transition-colors"
            >
              Buscar en catálogo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          ) : (
            <Link
              href={catalogSearchHref}
              onClick={onClose}
              className="inline-flex items-center gap-1 text-sm font-medium text-white bg-principal px-3 py-1.5 rounded-md hover:bg-principal/90 transition-colors"
            >
              Buscar en catálogo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          )
        )}

        {isSearchReason && !isDropdown ? (
          onViewCatalog ? (
            <button
              type="button"
              onClick={onViewCatalog}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-principal rounded-lg hover:bg-principal/90 transition-colors"
            >
              Ver catálogo completo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          ) : (
            <Link
              href={catalogBaseHref}
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-principal rounded-lg hover:bg-principal/90 transition-colors"
            >
              Ver catálogo completo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          )
        ) : !isSearchReason ? (
          onViewCatalog ? (
            <button
              type="button"
              onClick={onViewCatalog}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-principal rounded-lg hover:bg-principal/90 transition-colors"
            >
              Ver catálogo completo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>
          ) : (
            <Link
              href={catalogBaseHref}
              onClick={onClose}
              className={
                isDropdown
                  ? "text-sm text-principal hover:text-principal/80 font-medium"
                  : "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-principal rounded-lg hover:bg-principal/90 transition-colors"
              }
            >
              Ver catálogo completo
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          )
        ) : null}

        {isSearchReason && isDropdown && (
          <Link
            href={catalogBaseHref}
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-principal transition-colors underline underline-offset-2"
          >
            Ver catálogo completo
          </Link>
        )}
      </div>
    </div>
  );
}
