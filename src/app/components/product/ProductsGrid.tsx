import { memo } from "react";
import ProductCard from "@/app/components/Tienda/ProductCard";
import ScrollAnimate from "@/app/components/ui/ScrollAnimate";
import ProductCardSkeleton from "@/app/components/skeleton/product/ProductCardSkeleton";
import type { IProductos } from "@/app/types/producto.type";

interface ProductsGridProps {
  productos: IProductos[];
  isLoading?: boolean;
  itemsPerPage?: number;
}

function ProductsGridComponent({ productos, isLoading, itemsPerPage = 12 }: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-foreground/60">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
      {productos.map((producto, index) => (
        <ScrollAnimate
          key={producto.id_prod}
          direction="up"
          delay={index * 50}
        >
          <ProductCard producto={producto} />
        </ScrollAnimate>
      ))}
    </div>
  );
}

// Memoizar para evitar re-renders innecesarios cuando los productos no cambian
// Retorna true si son iguales (no re-renderizar), false si son diferentes (sí re-renderizar)
export const ProductsGrid = memo(ProductsGridComponent, (prevProps, nextProps) => {
  // Si cambió isLoading, sí re-renderizar
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  // Si cambió itemsPerPage, sí re-renderizar
  if (prevProps.itemsPerPage !== nextProps.itemsPerPage) return false;
  // Si cambió la cantidad de productos, sí re-renderizar
  if (prevProps.productos.length !== nextProps.productos.length) return false;
  // Si cambió algún producto (por ID), sí re-renderizar
  if (!prevProps.productos.every((prod, idx) => 
    prod.id_prod === nextProps.productos[idx]?.id_prod
  )) return false;
  // Si todo es igual, no re-renderizar
  return true;
});

