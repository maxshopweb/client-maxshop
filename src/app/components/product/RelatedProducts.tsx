"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IProductos } from "@/app/types/producto.type";
import ProductCard from "@/app/components/Tienda/ProductCard";

interface RelatedProductsProps {
  productos: IProductos[];
  isLoading?: boolean;
}

export default function RelatedProducts({ productos, isLoading }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  // Verificar si hay scroll disponible
  useEffect(() => {
    const checkScrollability = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };

    checkScrollability();
    
    // Re-verificar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkScrollability);
    
    // Verificar después de que se rendericen los productos
    const timeoutId = setTimeout(checkScrollability, 100);

    return () => {
      window.removeEventListener("resize", checkScrollability);
      clearTimeout(timeoutId);
    };
  }, [productos]);

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
        <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-terciario">
          Productos relacionados
        </h2>
        {canScroll && (
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-card-border/50 flex items-center justify-center hover:bg-principal/10 hover:border-principal transition-colors"
              aria-label="Desplazar izquierda"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-terciario" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-card-border/50 flex items-center justify-center hover:bg-principal/10 hover:border-principal transition-colors"
              aria-label="Desplazar derecha"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-terciario" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-thin pb-4 scroll-smooth"
        style={{ scrollbarWidth: "thin" }}
      >
        {productos.map((producto, index) => (
          <motion.div
            key={producto.id_prod}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px]"
          >
            <ProductCard producto={producto} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

