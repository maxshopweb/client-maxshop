"use client";

import { useState, Suspense, memo, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import FiltersSidebar from "@/app/components/Tienda/FiltersSidebar";
import { ProductsHeader } from "./ProductsHeader";
import { ProductsGrid } from "./ProductsGrid";
import { PaginationControls } from "./PaginationControls";
import { useProductFilters } from "../../hooks/productos/useProductFilters";
import { useProductos } from "../../hooks/productos/useProductos";
import type { IProductoFilters } from "@/app/types/producto.type";

// Memoizar FiltersSidebar para evitar re-renders innecesarios
const MemoizedFiltersSidebar = memo(FiltersSidebar);

MemoizedFiltersSidebar.displayName = 'MemoizedFiltersSidebar';

function ProductsPageContent() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Obtener filtros y paginación desde URL usando el hook
  const { backendFilters, filters, page, limit } = useProductFilters();
  
  // FILTROS PARA TIENDA (CLIENTE):
  // El endpoint /productos/tienda ya aplica automáticamente:
  // - Marca 051 (INGCO) fijo
  // - Solo productos con imagen
  // - Solo productos publicados (activo: "A")
  const finalFilters = useMemo<IProductoFilters>(() => {
    const final: IProductoFilters = {
      page: backendFilters.page || page,
      limit: backendFilters.limit || limit,
      order_by: backendFilters.order_by,
      order: backendFilters.order,
      busqueda: backendFilters.busqueda,
      id_cat: backendFilters.id_cat,
      codi_grupo: backendFilters.codi_grupo,
      precio_min: backendFilters.precio_min,
      precio_max: backendFilters.precio_max,
      destacado: backendFilters.destacado,
      financiacion: backendFilters.financiacion,
    };

    return final;
  }, [backendFilters, page, limit]);

  // Obtener productos usando el endpoint específico de tienda
  const {
    productos,
    pagination,
    isLoading,
    isFetching,
  } = useProductos({
    filters: finalFilters,
    enabled: true,
    keepPreviousData: true,
    useTiendaEndpoint: true, // Usar endpoint de tienda
  });

  // Filtrar productos por oferta en el cliente (el backend no tiene campo directo)
  // Un producto está en oferta si precio < precio_minorista
  const productosConOfertaFiltrada = useMemo(() => {
    if (!filters.oferta) return productos;
    
    return productos.filter((producto) => {
      const precio = producto.precio || 0;
      const precioMinorista = producto.precio_minorista || 0;
      return precio < precioMinorista;
    });
  }, [productos, filters.oferta]);

  // Calcular índices para mostrar en el header
  // Si hay filtro de oferta, el total puede cambiar porque se filtra en cliente
  const totalProductos = filters.oferta ? productosConOfertaFiltrada.length : (pagination?.total || 0);
  const startIndex = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const endIndex = pagination ? startIndex + productosConOfertaFiltrada.length - 1 : 0;

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(newPage));
    
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, router]);

  const handleFiltersOpen = useCallback(() => {
    setIsFiltersOpen(true);
  }, []);

  const handleFiltersClose = useCallback(() => {
    setIsFiltersOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-10">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-6 py-6">
        {/* Overlay para mobile */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/50 z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleFiltersClose}
            />
          )}
        </AnimatePresence>

        {/* Sidebar de Filtros - Desktop */}
        <div className="hidden lg:block lg:w-80 flex-shrink-0">
          <MemoizedFiltersSidebar />
        </div>

        {/* Sidebar de Filtros - Mobile */}
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
                duration: 0.3,
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
                    onClick={handleFiltersClose}
                    className="p-2 hover:bg-input rounded-lg transition-colors"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </motion.button>
                </motion.div>
                <div className="flex-1 overflow-y-auto">
                  <MemoizedFiltersSidebar />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contenido Principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <ProductsHeader
            startIndex={startIndex}
            endIndex={endIndex}
            total={totalProductos}
            onFiltersOpen={handleFiltersOpen}
          />

          <div className="space-y-6">
            {isLoading && productosConOfertaFiltrada.length === 0 ? (
              <ProductsGrid 
                productos={[]} 
                isLoading={true}
                itemsPerPage={limit} 
              />
            ) : productosConOfertaFiltrada.length === 0 ? (
              <div className="text-center py-20 bg-gray-100">
                <p className="text-lg text-foreground/60">
                  No se encontraron productos con los filtros aplicados
                </p>
              </div>
            ) : (
              <>
                <ProductsGrid 
                  productos={productosConOfertaFiltrada} 
                  itemsPerPage={limit} 
                />
                {pagination && pagination.totalPages > 1 && (
                  <PaginationControls
                    currentPage={page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPageClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-10">
          <div className="container mx-auto px-4 py-6">
            <ProductsGrid 
              productos={[]} 
              isLoading={true}
              itemsPerPage={12} 
            />
          </div>
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}

