"use client";

import Link from "next/link";
import { Star, Sparkles } from "lucide-react";
import type { IProductos } from "@/app/types/producto.type";
import AddToCartButton from "@/app/components/cart/AddToCartButton";
import ProductImage from "@/app/components/shared/ProductImage";

interface ProductCardProps {
  producto: IProductos;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const precioFinal = Number(producto.precio || producto.precio_minorista || 0);
  const precioMinorista = Number(producto.precio_minorista || 0);
  const precio = Number(producto.precio || 0);
  
  const tieneDescuento = precioMinorista && precio && precio < precioMinorista;
  const porcentajeDescuento = tieneDescuento
    ? Math.round(((precioMinorista - precio) / precioMinorista) * 100)
    : 0;
  
  const esDestacado = producto.destacado;
  const esOferta = tieneDescuento && porcentajeDescuento > 0;

  return (
    <Link 
      href={`/tienda/productos/${producto.id_prod}`}
      className="group bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-lg hover:-translate-y-1 max-h-full"
    >
      {/* Imagen del Producto */}
      <div className="relative aspect-square bg-gradient-to-br from-background to-background/50 overflow-hidden">
        {/* Badge de Oferta */}
        {/* {esOferta && (
          <div className="absolute top-3 left-3 bg-principal text-white px-3 py-1.5 rounded-full text-xs font-semibold z-10 shadow-md">
            -{porcentajeDescuento}% OFF
          </div>
        )} */}

        {/* Badge de Destacado */}
        {esDestacado && !esOferta && (
          <div className="absolute top-3 right-3 z-10 bg-principal/10 backdrop-blur-sm p-2 rounded-full">
            <Star 
              size={18} 
              className="fill-principal text-principal" 
            />
          </div>
        )}

        {/* Badge combinado: Destacado + Oferta */}
        {/* {esDestacado && esOferta && (
          <div className="absolute top-3 right-3 z-10 bg-principal/10 backdrop-blur-sm p-1.5 rounded-full">
            <Sparkles 
              size={16} 
              className="text-principal" 
            />
          </div>
        )} */}

        {/* Imagen */}
        <ProductImage 
          imgPrincipal={producto.img_principal}
          codiArti={producto.codi_arti}
          nombre={producto.nombre}
          className="p-2 sm:p-4 group-hover:scale-105"
          size="lg"
        />

        {/* Overlay sutil al hover */}
        <div className="absolute inset-0 bg-principal/0 group-hover:bg-principal/5 transition-colors duration-300"></div>
      </div>

      {/* Información del Producto */}
      <div className="p-3 sm:p-5 flex flex-col flex-1">
        {/* Nombre del Producto */}
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-terciario group-hover:text-principal transition-colors line-clamp-2 min-h-[2.5rem] mb-1 sm:mb-2 leading-tight capitalize">
          {producto.nombre || "Producto sin nombre"}
        </h3>

        {/* Marca */}
        {producto.marca && (
          <p className="text-xs text-terciario/50 mb-2 sm:mb-4 capitalize">
            {producto.marca.nombre}
          </p>
        )}

        {/* Precio */}
        <div className="mt-auto space-y-2 sm:space-y-3">
          <div>
            {esOferta ? (
              <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-principal">
                  ${precioFinal.toFixed(2)}
                </span>
                <span className="text-xs sm:text-sm text-terciario/40 line-through">
                  ${precioMinorista.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-principal">
                ${precioFinal.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Botón Agregar al Carrito */}
          <div onClick={(e) => e.stopPropagation()}>
            <AddToCartButton
              producto={producto}
              variant="secondary"
              size="lg"
              showIcon={true}
              className="w-full text-xs sm:text-sm"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

