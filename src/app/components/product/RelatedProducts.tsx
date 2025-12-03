"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { IProductos } from "@/app/types/producto.type";
import { formatPrecio } from "@/app/types/producto.type";
import ProductImage from "@/app/components/shared/ProductImage";
import { Button } from "../ui/Button";

interface RelatedProductsProps {
  productos: IProductos[];
  isLoading?: boolean;
}

export default function RelatedProducts({ productos, isLoading }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 300;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newScroll =
      direction === "left"
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Productos Relacionados</h2>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[280px] bg-gray-200 animate-pulse rounded-lg aspect-square"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Productos Relacionados
        </h2>
        {productos.length > 4 && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border-2 border-card-border flex items-center justify-center hover:bg-principal/10 hover:border-principal transition-colors"
              aria-label="Desplazar izquierda"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border-2 border-card-border flex items-center justify-center hover:bg-principal/10 hover:border-principal transition-colors"
              aria-label="Desplazar derecha"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {productos.map((producto, index) => {
          const precioFinal = producto.precio || producto.precio_minorista || 0;
          const precioOriginal =
            producto.precio_minorista &&
            producto.precio &&
            producto.precio < producto.precio_minorista
              ? producto.precio_minorista
              : null;
          const tieneDescuento = precioOriginal !== null;

          return (
            <motion.div
              key={producto.id_prod}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex-shrink-0 w-[280px] sm:w-[300px]"
            >
              <Link
                href={`/productos/${producto.id_prod}`}
                className="group bg-card rounded-xl overflow-hidden border border-card-border transition-all duration-300 flex flex-col h-full hover:shadow-lg hover:-translate-y-1"
              >
                {/* Imagen */}
                <div className="relative aspect-square bg-white overflow-hidden">
                  <ProductImage
                    imgPrincipal={producto.img_principal}
                    codiArti={producto.codi_arti}
                    nombre={producto.nombre}
                    className="p-4 group-hover:scale-105 transition-transform duration-300"
                    size="lg"
                  />
                  {producto.destacado && (
                    <div className="absolute top-3 right-3 bg-principal/10 backdrop-blur-sm p-2 rounded-full">
                      <span className="text-xs font-semibold text-principal">⭐</span>
                    </div>
                  )}
                </div>

                {/* Información */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-base font-semibold text-foreground group-hover:text-principal transition-colors line-clamp-2 mb-2 min-h-[3rem]">
                    {producto.nombre || "Producto sin nombre"}
                  </h3>

                  {producto.marca?.nombre && (
                    <p className="text-xs text-foreground/60 mb-3">
                      {producto.marca.nombre}
                    </p>
                  )}

                  <div className="mt-auto space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-principal">
                        {formatPrecio(precioFinal)}
                      </span>
                      {tieneDescuento && precioOriginal && (
                        <span className="text-sm text-foreground/50 line-through">
                          {formatPrecio(precioOriginal)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

