import { memo, useCallback } from "react";
import { Filter } from "lucide-react";
import { ProductSortSelector } from "@/app/components/Tienda/ProductSortSelector";

interface ProductsHeaderProps {
  startIndex: number;
  endIndex: number;
  total: number;
  onFiltersOpen: () => void;
}

function ProductsHeaderComponent({
  startIndex,
  endIndex,
  total,
  onFiltersOpen,
}: ProductsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 px-1">
      <div className="flex items-center gap-3 w-full sm:w-auto">
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
  );
}

// Memoizar para evitar re-renders innecesarios
export const ProductsHeader = memo(ProductsHeaderComponent);

