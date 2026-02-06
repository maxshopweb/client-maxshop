"use client";

import Link from "next/link";
import { Star, Sparkles, Tag } from "lucide-react";
import type { IProductos } from "@/app/types/producto.type";
import AddToCartButton from "@/app/components/cart/AddToCartButton";
import ProductImage from "@/app/components/shared/ProductImage";

interface ProductCardProps {
  producto: IProductos;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const precioFinal = Number(producto.precio ?? 0);
  const listaActiva = producto.lista_activa;
  const esOferta = listaActiva?.es_oferta === true;
  const esCampanya = listaActiva?.es_campanya === true;
  const esDestacado = producto.destacado;

  return (
    <Link 
      href={`/tienda/productos/${producto.id_prod}`}
      className="group bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-lg hover:-translate-y-1 max-h-full"
    >
      {/* Imagen del Producto */}
      <div className="relative aspect-square bg-gradient-to-br from-background to-background/50 overflow-hidden">
        {/* Badge por tipo de lista: Oferta (destacado) */}
        {esOferta && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold z-10 shadow-md flex items-center gap-1">
            <Tag size={12} />
            Oferta
          </div>
        )}

        {/* Badge Campaña */}
        {esCampanya && !esOferta && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-semibold z-10 shadow-md flex items-center gap-1">
            <Sparkles size={12} />
            Campaña
          </div>
        )}

        {/* Badge Destacado (cuando no es oferta/campaña) */}
        {esDestacado && !esOferta && !esCampanya && (
          <div className="absolute top-3 right-3 z-10 bg-principal/10 backdrop-blur-sm p-2 rounded-full">
            <Star size={18} className="fill-principal text-principal" />
          </div>
        )}

        {/* Destacado + Oferta/Campaña: estrella a la derecha */}
        {(esOferta || esCampanya) && esDestacado && (
          <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
            <Star size={16} className="fill-principal text-principal" />
          </div>
        )}

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
            <span
              className={`text-lg sm:text-xl md:text-2xl font-bold ${
                esOferta ? "text-amber-600" : esCampanya ? "text-emerald-700" : "text-principal"
              }`}
            >
              ${precioFinal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
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

