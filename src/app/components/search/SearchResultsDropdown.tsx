"use client";

import Link from "next/link";
import type { IProductos } from "@/app/types/producto.type";
import ProductImage from "@/app/components/shared/ProductImage";
import { Package } from "lucide-react";
import SearchEmptyState from "./SearchEmptyState";
import { buildCatalogSearchUrl } from "@/app/utils/catalog-search.utils";

interface SearchProductItemProps {
  producto: IProductos;
  onClick?: () => void;
}

const SearchProductItem = ({ producto, onClick }: SearchProductItemProps) => {
  const nombre = producto.nombre || "Producto sin nombre";
  const precio = Number(producto.precio || producto.precio_minorista || 0);
  const marca = producto.marca?.nombre || "";

  return (
    <Link
      href={`/tienda/productos/${producto.id_prod}`}
      onClick={onClick}
      className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-principal hover:shadow-md cursor-pointer transition-all group bg-white"
    >
      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        {producto.img_principal ? (
          <ProductImage
            imgPrincipal={producto.img_principal}
            codiArti={producto.codi_arti}
            nombre={nombre}
            className="p-1"
            size="sm"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Package className="w-5 h-5 text-gray-400" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm text-terciario line-clamp-2 group-hover:text-principal transition-colors">
          {nombre}
        </h3>
        {producto.modelo?.trim() && (
          <p className="text-xs text-terciario/70 mt-0.5 line-clamp-1">{producto.modelo.trim()}</p>
        )}
        {marca && (
          <p className="text-xs text-gray-500 mt-0.5">{marca}</p>
        )}
        <p className="text-sm font-bold text-principal mt-1">
          ${precio.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

interface SearchResultsDropdownProps {
  results: IProductos[];
  isVisible: boolean;
  searchQuery: string;
  maxResults?: number;
  onClose?: () => void;
  onSubmitSearch?: (query: string) => void;
  isLoading?: boolean;
  resultsListId?: string;
}

export default function SearchResultsDropdown({
  results,
  isVisible,
  searchQuery,
  maxResults = 6,
  onClose,
  onSubmitSearch,
  isLoading = false,
  resultsListId,
}: SearchResultsDropdownProps) {
  if (!isVisible) {
    return null;
  }

  const displayResults = results.slice(0, maxResults);
  const hasResults = results.length > 0;
  const catalogSearchHref = buildCatalogSearchUrl(searchQuery);

  return (
    <div
      id={resultsListId}
      role="listbox"
      aria-label={`Resultados de búsqueda para ${searchQuery}`}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] max-h-[500px] overflow-hidden flex flex-col"
    >
      {/* Header con contador o estado de carga */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50" aria-live="polite">
        <p className="text-xs text-gray-600">
          {isLoading
            ? `Buscando "${searchQuery}"...`
            : hasResults
              ? `${results.length} resultado${results.length !== 1 ? "s" : ""} para "${searchQuery}"`
              : `Sin coincidencias para "${searchQuery}"`}
        </p>
      </div>

      {/* Lista de productos o mensaje vacío */}
      <div className="overflow-y-auto flex-1 p-2">
        {isLoading ? (
          <div className="py-6 text-center text-sm text-gray-500">Cargando productos...</div>
        ) : !hasResults ? (
          <SearchEmptyState
            variant="dropdown"
            reason="search"
            searchQuery={searchQuery}
            onClose={onClose}
            onSearchInCatalog={() => onSubmitSearch?.(searchQuery)}
          />
        ) : (
          <div className="space-y-1">
            {displayResults.map((producto) => (
              <SearchProductItem
                key={producto.id_prod}
                producto={producto}
                onClick={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer: ver en catálogo cuando hay resultados */}
      {hasResults && !isLoading && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
          <Link
            href={catalogSearchHref}
            onClick={onClose}
            className="text-sm text-principal hover:text-principal/80 font-medium"
          >
            Ver todos en el catálogo
            {results.length > maxResults ? ` (${results.length})` : ""}
          </Link>
        </div>
      )}
    </div>
  );
}
