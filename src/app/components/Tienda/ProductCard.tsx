"use client";

import Link from "next/link";
import { Sparkles, Tag } from "lucide-react";
import type { IProductos } from "@/app/types/producto.type";
import AddToCartButton from "@/app/components/cart/AddToCartButton";
import ProductImage from "@/app/components/shared/ProductImage";
import { formatCurrencyARS } from "@/app/utils/currency";
import { getPrecioConImpuestos, getPrecioSinImpuestos } from "@/app/utils/producto.utils";

function HalfStar({ size = 18 }: { size?: number }) {
  const id = "half-star-grad";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.25" />
        </linearGradient>
      </defs>
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={`url(#${id})`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        className="text-principal"
      />
    </svg>
  );
}

interface ProductCardProps {
  producto: IProductos;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const precioSinImpuestos = getPrecioSinImpuestos(producto) ?? 0;
  const precioFinal = getPrecioConImpuestos(producto) ?? precioSinImpuestos;
  const listaActiva = producto.lista_activa;
  const esOferta = listaActiva?.es_oferta === true;
  const esCampanya = listaActiva?.es_campanya === true;
  const esDestacado = producto.destacado;
  const ref = producto.precio_venta_referencia;
  const mostrarTachado = ref != null && ref > precioFinal;
  const porcentajeOff =
    mostrarTachado && ref != null && ref > 0
      ? Math.round((1 - precioFinal / ref) * 100)
      : 0;

  return (
    <Link 
      href={`/tienda/productos/${producto.id_prod}`}
      className="group bg-white rounded-sm overflow-hidden transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-lg hover:-translate-y-1 max-h-full"
    >
      {/* Imagen del Producto */}
      <div className="relative aspect-square bg-gradient-to-br from-background to-background/50 overflow-hidden">
        {/* Badge por tipo de lista: Oferta (destacado) */}
        {esOferta && (
          <div className="absolute top-3 left-3 bg-amber-500 text-white px-2.5 py-1 rounded-sm text-xs font-semibold z-10 shadow-md flex items-center gap-1">
            <Tag size={12} />
            Oferta
          </div>
        )}

        {/* Badge Campaña */}
        {esCampanya && !esOferta && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2.5 py-1 rounded-sm text-xs font-semibold z-10 shadow-md flex items-center gap-1">
            <Sparkles size={12} />
            Campaña
          </div>
        )}

        {/* Badge Destacado (cuando no es oferta/campaña) */}
        {esDestacado && !esOferta && !esCampanya && (
          <div className="absolute top-3 right-3 z-10 bg-principal/10 backdrop-blur-sm p-2 rounded-sm text-principal">
            <HalfStar size={18} />
          </div>
        )}

        {/* Destacado + Oferta/Campaña: estrella a la derecha */}
        {(esOferta || esCampanya) && esDestacado && (
          <div className="absolute top-3 right-3 z-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-sm shadow-sm text-principal">
            <HalfStar size={16} />
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
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-terciario group-hover:text-principal transition-colors mb-1 sm:mb-2 leading-tight capitalize">
          {producto.nombre || "Producto sin nombre"}
        </h3>

        {/* Modelo (opcional, debajo del nombre) */}
        {producto.modelo?.trim() && (
          <p className="text-xs sm:text-sm text-terciario/70 mb-1">
            {producto.modelo.trim()}
          </p>
        )}

        {/* Marca */}
        {producto.marca && (
          <p className="text-xs text-terciario/50 mb-2 sm:mb-4 capitalize">
            {producto.marca.nombre}
          </p>
        )}

        {/* Precio: primero actual, después tachado y % OFF */}
        <div className="mt-auto space-y-2 sm:space-y-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span
              className={`text-lg sm:text-xl md:text-2xl font-bold ${
                esOferta ? "text-amber-600" : esCampanya ? "text-emerald-700" : "text-principal"
              }`}
            >
              {formatCurrencyARS(precioFinal)}
            </span>
            {mostrarTachado && (
              <>
                <span className="text-sm text-terciario/50 line-through">
                  {formatCurrencyARS(ref)}
                </span>
                {porcentajeOff > 0 && (
                  <span className="text-xs font-semibold text-amber-600">
                    {porcentajeOff}% OFF
                  </span>
                )}
              </>
            )}
          </div>
          {precioSinImpuestos > 0 && (
            <p className="text-xs text-terciario/60 mt-1">
              Sin impuestos: {formatCurrencyARS(precioSinImpuestos)}
            </p>
          )}
          
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

