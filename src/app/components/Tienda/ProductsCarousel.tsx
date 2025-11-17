"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRef } from "react";
import { productosService } from "@/app/services/producto.service";
import ProductCard from "./ProductCard";
import Link from "next/link";

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Obtener productos según el filtro
  const { data, isLoading } = useQuery({
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

  return (
    <section className="py-6 md:py-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Título Centrado */}
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-principal mb-2 px-2">
            {title}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
            <div className="h-px w-8 md:w-16 bg-principal"></div>
            <div className="w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-principal"></div>
            <div className="h-px w-8 md:w-16 bg-principal"></div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Botón Anterior */}
          {productos.length > 2 && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-secundario shadow-xl p-2 md:p-3 rounded-full hover:bg-principal hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 border border-gray-200 dark:border-white/10 touch-manipulation hidden sm:flex"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} className="md:w-6 md:h-6" />
            </button>
          )}

          {/* Productos */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-principal" />
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-text/60">No hay productos disponibles</p>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 snap-x snap-mandatory"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
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
              className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-secundario shadow-xl p-2 md:p-3 rounded-full hover:bg-principal hover:text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 border border-gray-200 dark:border-white/10 touch-manipulation hidden sm:flex"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} className="md:w-6 md:h-6" />
            </button>
          )}
        </div>

        {/* Botón Ver Todos */}
        {showViewAllButton && productos.length > 0 && (
          <div className="text-center mt-6 md:mt-10">
            <Link
              href="/tienda/productos"
              className="group inline-flex items-center gap-2 text-principal hover:text-principal/90 font-bold text-base md:text-lg transition-all duration-300 touch-manipulation"
            >
              <span className="underline decoration-2 underline-offset-4 decoration-principal group-hover:decoration-principal/70">
                VER TODOS LOS PRODUCTOS
              </span>
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* CSS para ocultar scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
