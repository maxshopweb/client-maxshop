"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { productosService } from "@/app/services/producto.service";
import ProductCard from "./ProductCard";
import SectionTitle from "./SectionTitle";
import { Button } from "../ui/Button";

interface ProductsCarouselProps {
  title: string;
  filter?: "destacados" | "all" | "ofertas";
  showViewAllButton?: boolean;
}

export default function ProductsCarousel({ 
  title, 
  filter = "all",
  showViewAllButton = true 
}: ProductsCarouselProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Obtener productos según el filtro
  const { data } = useQuery({
    queryKey: ["productos", filter],
    queryFn: () => {
      if (filter === "destacados") {
        return productosService.getAll({ destacado: true, limit: 20, estado: 1 });
      }
      return productosService.getAll({ limit: 20, estado: 1 });
    },
  });

  const productos = data?.data || [];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollPosition =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleViewAll = () => {
    if (filter === "destacados") {
      router.push("/tienda/productos?destacado=true");
    } else {
      router.push("/tienda/productos");
    }
  };

  return (
    <SectionTitle title={title}>
      {/* Carousel Container */}
      <div className="relative group overflow-hidden">
        {/* Botón Anterior */}
        {productos.length > 2 && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-background border border-input shadow-lg p-2 md:p-3 rounded-full hover:bg-principal hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation hidden sm:flex"
            aria-label="Anterior"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>
        )}

        {/* Productos */}
        {productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg md:text-xl text-foreground/60">No hay productos disponibles</p>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {productos.map((producto) => (
              <div
                key={producto.id_prod}
                className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[280px] md:w-[320px] snap-start"
              >
                <ProductCard producto={producto} />
              </div>
            ))}
          </div>
        )}

        {/* Botón Siguiente */}
        {productos.length > 2 && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-background border border-input shadow-lg p-2 md:p-3 rounded-full hover:bg-principal hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 touch-manipulation hidden sm:flex"
            aria-label="Siguiente"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>
        )}
      </div>

      {/* Botón Ver Todos */}
      {showViewAllButton && productos.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button 
            variant="primary" 
            size="lg"
            onClick={handleViewAll}
          >
            Ver todos los productos {filter === "destacados" && "destacados"}
          </Button>
        </div>
      )}

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </SectionTitle>
  );
}
