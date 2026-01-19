"use client";

import Link from "next/link";
import type { IProductos } from "@/app/types/producto.type";
import ProductImage from "@/app/components/shared/ProductImage";
import { Package } from "lucide-react";

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
}

export default function SearchResultsDropdown({
  results,
  isVisible,
  searchQuery,
  maxResults = 6,
  onClose,
}: SearchResultsDropdownProps) {
  if (!isVisible || results.length === 0) {
    return null;
  }

  const displayResults = results.slice(0, maxResults);
  const hasMore = results.length > maxResults;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[60] max-h-[500px] overflow-hidden flex flex-col">
      {/* Header con contador */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600">
          {results.length} resultado{results.length !== 1 ? 's' : ''} para "{searchQuery}"
        </p>
      </div>

      {/* Lista de productos */}
      <div className="overflow-y-auto flex-1 p-2">
        <div className="space-y-1">
          {displayResults.map((producto) => (
            <SearchProductItem
              key={producto.id_prod}
              producto={producto}
              onClick={onClose}
            />
          ))}
        </div>
      </div>

      {/* Footer si hay más resultados */}
      {hasMore && (
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-center">
          <Link
            href={`/tienda/productos?search=${encodeURIComponent(searchQuery)}`}
            onClick={onClose}
            className="text-sm text-principal hover:text-principal/80 font-medium"
          >
            Ver todos los resultados ({results.length})
          </Link>
        </div>
      )}
    </div>
  );
}

