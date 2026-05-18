import { memo } from "react";
import { Filter, X } from "lucide-react";
import { ProductSortSelector } from "@/app/components/Tienda/ProductSortSelector";
import { formatPriceFilterRange } from "@/app/utils/price-filter.utils";

interface ProductsHeaderProps {
  startIndex: number;
  endIndex: number;
  total: number;
  onFiltersOpen: () => void;
  minPrice?: number;
  maxPrice?: number;
  onClearPriceFilter?: () => void;
}

function ProductsHeaderComponent({
  startIndex,
  endIndex,
  total,
  onFiltersOpen,
  minPrice,
  maxPrice,
  onClearPriceFilter,
}: ProductsHeaderProps) {
  const showPriceChip =
    (minPrice !== undefined && minPrice > 0) ||
    (maxPrice !== undefined && maxPrice > 0);

  return (
    <div className="flex flex-col gap-3 mb-4 px-1">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <button
            onClick={onFiltersOpen}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-principal hover:text-white transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Filtros</span>
          </button>
          <div className="text-sm text-foreground/70">
            Mostrando {startIndex + 1} - {Math.min(endIndex, total)} de {total} productos
          </div>
        </div>
        <ProductSortSelector className="w-full sm:w-auto" />
      </div>

      {showPriceChip && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-principal/10 text-principal border border-principal/20 rounded-full pl-3 pr-1 py-1">
            {formatPriceFilterRange(minPrice, maxPrice)}
            {onClearPriceFilter && (
              <button
                type="button"
                onClick={onClearPriceFilter}
                className="p-0.5 rounded-full hover:bg-principal/20 transition-colors"
                aria-label="Quitar filtro de precio"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export const ProductsHeader = memo(ProductsHeaderComponent);
