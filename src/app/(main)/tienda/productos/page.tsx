"use client";

import { useState, useMemo, Suspense } from "react";
import { useProductos } from "@/app/hooks/productos/useProductos";
import FiltersSidebar from "@/app/components/Tienda/FiltersSidebar";
import ProductsHero from "@/app/components/Tienda/ProductsHero";
import ProductCard from "@/app/components/Tienda/ProductCard";
import ScrollAnimate from "@/app/components/ui/ScrollAnimate";
import ProductCardSkeleton from "@/app/components/skeleton/product/ProductCardSkeleton";
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { IProductos } from "@/app/types/producto.type";
import { motion, AnimatePresence } from "framer-motion";

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

// Filtros locales (sin URL)
interface LocalFilters {
  busqueda?: string;
  precio_min?: number;
  precio_max?: number;
  id_cat?: number;
  id_marca?: number;
  codi_grupo?: string;
}

// Componente interno que puede usar hooks con useSearchParams
function ProductosContent() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [localFilters, setLocalFilters] = useState<LocalFilters>({});
  
  // Cargar TODOS los productos destacados de una vez (sin paginación del servidor)
  const { productos: allProductos, isLoading, isError } = useProductos({
    filters: {
      page: 1,
      limit: 1000, // Límite alto para traer todos
      destacado: true, // Solo productos destacados
      order_by: 'creado_en',
      order: 'desc',
    },
    keepPreviousData: true,
  });
  
  // Filtrar productos en el cliente
  const filteredProductos = useMemo(() => {
    if (!allProductos || allProductos.length === 0) return [];
    
    return allProductos.filter((producto: IProductos) => {
      // Búsqueda por nombre
      if (localFilters.busqueda) {
        const searchTerm = localFilters.busqueda.toLowerCase();
        const nombre = producto.nombre?.toLowerCase() || '';
        const descripcion = producto.descripcion?.toLowerCase() || '';
        if (!nombre.includes(searchTerm) && !descripcion.includes(searchTerm)) {
          return false;
        }
      }
      
      // Filtro por precio
      const precio = producto.precio || producto.precio_minorista || 0;
      if (localFilters.precio_min !== undefined && precio < localFilters.precio_min) {
        return false;
      }
      if (localFilters.precio_max !== undefined && precio > localFilters.precio_max) {
        return false;
      }
      
      // Filtro por categoría
      if (localFilters.id_cat !== undefined) {
        // Usar la relación categoria si está disponible, sino usar codi_categoria
        if (producto.categoria?.id_cat !== localFilters.id_cat) {
          return false;
        }
      }
      
      // Filtro por marca
      if (localFilters.id_marca !== undefined) {
        // Usar la relación marca si está disponible
        if (producto.marca?.id_marca !== localFilters.id_marca) {
          return false;
        }
      }
      
      // Filtro por grupo
      if (localFilters.codi_grupo !== undefined) {
        if (producto.codi_grupo !== localFilters.codi_grupo) {
          return false;
        }
      }
      
      return true;
    });
  }, [allProductos, localFilters]);
  
  // Paginación en el cliente (10 productos por página)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProductos = filteredProductos.slice(startIndex, endIndex);
  
  // Resetear página cuando cambian los filtros
  const handleFilterChange = (newFilters: LocalFilters) => {
    setLocalFilters(newFilters);
    setCurrentPage(1);
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-10">
      {/* Hero Section - Hero empieza desde arriba, navbar se superpone */}
      {/* <section className="w-full -mt-[calc(3.5rem+3rem)] md:-mt-[calc(4rem+3.5rem)]">
        <ProductsHero title="Tienda" categoryName="Productos Destacados" />
      </section> */}

      {/* Contenido Principal - Ocupa 100vh y sigue el scroll normal */}
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 py-6">

        {/* Overlay para mobile con animación */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsFiltersOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar de Filtros - Modal en mobile, sticky en desktop */}
        {/* Desktop: Directamente el sidebar con sticky */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <FiltersSidebar 
            localFilters={localFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Mobile: Sidebar con animación */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              className="lg:hidden fixed inset-y-0 left-0 z-[110] w-80"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ 
                type: "spring",
                damping: 25,
                stiffness: 200,
                duration: 0.3
              }}
            >
              <div className="h-full bg-sidebar rounded-lg overflow-hidden flex flex-col shadow-2xl">
                <motion.div
                  className="flex items-center justify-between p-4 border-b border-input"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.2 }}
                >
                  <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
                  <motion.button
                    onClick={() => setIsFiltersOpen(false)}
                    className="p-2 hover:bg-input rounded-lg transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </motion.button>
                </motion.div>
                <div className="flex-1 overflow-y-auto">
                  <FiltersSidebar 
                    localFilters={localFilters}
                    onFilterChange={handleFilterChange}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid de Productos - Sigue el scroll normal de la página */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header con resultados */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 px-1">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Botón filtros en mobile */}
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-principal hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filtros</span>
              </button>
              <div className="text-sm text-foreground/70">
                Mostrando {startIndex + 1} - {Math.min(endIndex, filteredProductos.length)} de {filteredProductos.length} productos
              </div>
            </div>
          </div>

          {/* Grid de Productos */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : isError ? (
              <div className="text-center py-20">
                <p className="text-lg text-foreground/60">Error al cargar productos</p>
              </div>
            ) : !allProductos || allProductos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-foreground/60">No se encontraron productos destacados</p>
              </div>
            ) : filteredProductos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-foreground/60">No se encontraron productos con los filtros aplicados</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {paginatedProductos.map((producto, index) => (
                    <ScrollAnimate
                      key={producto.id_prod}
                      direction="up"
                      delay={index * 50}
                    >
                      <ProductCard producto={producto} />
                    </ScrollAnimate>
                  ))}
                </div>
                
                {/* Controles de Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-input">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1 || isLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-principal hover:text-white hover:border-principal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Anterior</span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground/70">
                        Página {currentPage} de {totalPages}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages || isLoading}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background text-foreground hover:bg-principal hover:text-white hover:border-principal transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="text-sm font-medium">Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente principal con Suspense boundary
export default function ProductosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    }>
      <ProductosContent />
    </Suspense>
  );
}

