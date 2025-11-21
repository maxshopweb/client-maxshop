"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productosService } from "@/app/services/producto.service";
import { useProductosFilters } from "@/app/hooks/productos/useProductFilter";
import FiltersSidebar from "@/app/components/Tienda/FiltersSidebar";
import ProductsHero from "@/app/components/Tienda/ProductsHero";
import ProductCard from "@/app/components/Tienda/ProductCard";
import ScrollAnimate from "@/app/components/ui/ScrollAnimate";
import type { ICategoria } from "@/app/types/categoria.type";
import FilterSelect from "@/app/components/ui/FilterSelect";
import ProductCardSkeleton from "@/app/components/skeleton/product/ProductCardSkeleton";
import { Filter, X } from "lucide-react";

const ORDEN_OPTIONS = [
  { value: 'precio-asc', label: 'Precio: Menor a Mayor' },
  { value: 'precio-desc', label: 'Precio: Mayor a Menor' },
  { value: 'nombre-asc', label: 'Nombre: A a Z' },
  { value: 'nombre-desc', label: 'Nombre: Z a A' },
  { value: 'stock-asc', label: 'Stock: Menor a Mayor' },
  { value: 'stock-desc', label: 'Stock: Mayor a Menor' },
  { value: 'creado_en-desc', label: 'Más recientes' },
  { value: 'creado_en-asc', label: 'Más antiguos' },
]

export default function ProductosPage() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get("categoria");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const {
    filters,
    setFilter,
    categorias,
    nextPage,
    prevPage,
    goToPage,
    setSort,
  } = useProductosFilters();

  // Convertir valor del select a order_by y order
  const getCurrentOrderValue = () => {
    if (filters.order_by && filters.order) {
      const value = `${filters.order_by}-${filters.order}`;
      // Verificar que el valor existe en las opciones
      const exists = ORDEN_OPTIONS.some(opt => opt.value === value);
      return exists ? value : 'creado_en-desc';
    }
    return 'creado_en-desc';
  };

  const handleOrderChange = (value: string | number) => {
    const orderValue = String(value);
    const [orderBy, order] = orderValue.split('-');
    if (orderBy && order) {
      setFilter('order_by', orderBy as any);
      setFilter('order', order as 'asc' | 'desc');
    }
  };

  // Sincronizar parámetro de URL con filtros
  useEffect(() => {
    if (categoriaParam && !filters.id_cat) {
      setFilter("id_cat", Number(categoriaParam));
    }
  }, [categoriaParam, filters.id_cat, setFilter]);

  // Obtener nombre de categoría si hay filtro
  const categoriaActual = categorias.find((cat: ICategoria) => cat.id_cat === filters.id_cat);
  const categoryName = categoriaActual?.nombre || "Productos";

  // Obtener productos
  const { data, isLoading, isError } = useQuery({
    queryKey: ["productos", "tienda", filters],
    queryFn: () => productosService.getAll({ ...filters, estado: 1 }),
  });

  const productos = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const currentPage = filters.page || 1;
  const totalResults = data?.total || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section - Hero empieza desde arriba, navbar se superpone */}
      <section className="w-full -mt-[calc(3.5rem+3rem)] md:-mt-[calc(4rem+3.5rem)] flex-shrink-0">
        <ProductsHero title="Tienda" categoryName={categoryName} />
      </section>

      {/* Contenido Principal - Flex para ocupar el resto del vh */}
      <div className="container mx-auto px-4 flex-1 flex flex-col lg:flex-row gap-6 py-6">

        {/* Overlay para mobile */}
        {isFiltersOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[100] transition-opacity"
            onClick={() => setIsFiltersOpen(false)}
          />
        )}

        {/* Sidebar de Filtros - Modal en mobile, fixed en desktop */}
        <div
          className={`lg:w-80 flex-shrink-0 transition-transform duration-300 ${
            isFiltersOpen
              ? 'fixed inset-y-0 left-0 z-[110] w-80'
              : 'hidden lg:block'
          }`}
        >
          <div className="h-full bg-sidebar rounded-lg lg:rounded-lg overflow-hidden flex flex-col">
            {/* Header mobile con botón cerrar */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-input">
              <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="p-2 hover:bg-input rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FiltersSidebar />
            </div>
          </div>
        </div>

        {/* Grid de Productos - Con scroll interno */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header con resultados y ordenamiento */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 flex-shrink-0 px-1">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Botón filtros en mobile */}
              <button
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-input rounded-lg bg-background text-foreground hover:bg-principal hover:text-white transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filtros</span>
              </button>
              <div className="text-sm text-foreground/70 hidden sm:block">
                Mostrando {productos.length > 0 ? (currentPage - 1) * (filters.limit || 25) + 1 : 0}-
                {Math.min(currentPage * (filters.limit || 25), totalResults)} de {totalResults} resultados
              </div>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:min-w-[220px] sm:w-auto">
                <FilterSelect
                  placeholder="Ordenar por"
                  options={ORDEN_OPTIONS}
                  value={getCurrentOrderValue()}
                  onChange={handleOrderChange}
                />
              </div>
            </div>
          </div>

          {/* Grid de Productos - Con scroll */}
          <div className="flex-1 overflow-y-auto space-y-6 min-h-0">
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
            ) : productos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg text-foreground/60">No se encontraron productos</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8 pb-4">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-principal hover:text-white transition-colors"
                    >
                      ←
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`px-4 py-2 border rounded-lg transition-colors ${
                              currentPage === page
                                ? "bg-principal text-white border-principal"
                                : "bg-background text-foreground border-input hover:bg-principal hover:text-white"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-foreground/40">...</span>;
                      }
                      return null;
                    })}
                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-input rounded-lg bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-principal hover:text-white transition-colors"
                    >
                      →
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

