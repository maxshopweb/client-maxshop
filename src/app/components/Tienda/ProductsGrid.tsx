"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { productosService } from "@/app/services/producto.service";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";
import { Button } from "../ui/Button";
import ProductCardSkeleton from "@/app/components/skeleton/product/ProductCardSkeleton";

interface ProductsGridProps {
  title: string;
  filter?: "destacados" | "publicados" | "all" | "ofertas";
  showViewAllButton?: boolean;
  rows?: number;
  cols?: number;
}

export default function ProductsGrid({
  title,
  filter = "all",
  showViewAllButton = true,
  rows = 2,
  cols = 4,
}: ProductsGridProps) {
  const router = useRouter();
  const limit = rows * cols;

  const { data, isLoading } = useQuery({
    queryKey: ["productos-tienda-grid", filter, limit],
    queryFn: () => {
      if (filter === "destacados") {
        return productosService.getProductosTienda({ destacado: true, limit });
      }
      if (filter === "publicados") {
        return productosService.getProductosTienda({ destacado: false, limit });
      }
      return productosService.getProductosTienda({ limit });
    },
  });

  const productos = (data?.data || []).slice(0, limit);

  const handleViewAll = () => {
    if (filter === "destacados") {
      router.push("/tienda/productos?destacado=true");
    } else if (filter === "publicados") {
      router.push("/tienda/productos?destacado=false");
    } else {
      router.push("/tienda/productos");
    }
  };

  return (
    <SectionTitle title={title}>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {Array.from({ length: limit }).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg text-foreground/50">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {productos.map((producto) => (
            <ProductCard key={producto.id_prod} producto={producto} />
          ))}
        </div>
      )}

      {showViewAllButton && productos.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button variant="primary" size="lg" onClick={handleViewAll}>
            Ver todos los productos
          </Button>
        </div>
      )}
    </SectionTitle>
  );
}
