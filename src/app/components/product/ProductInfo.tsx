"use client";

import { motion } from "framer-motion";
import { Package, CreditCard, Tag, Sparkles } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { IProductos } from "@/app/types/producto.type";
import { formatPrecio, getStockInfo } from "@/app/types/producto.type";
import { getPrecioConImpuestos, getPrecioSinImpuestos } from "@/app/utils/producto.utils";
import { formatCurrencyARS } from "@/app/utils/currency";

interface ProductInfoProps {
  producto: IProductos;
}

export default function ProductInfo({ producto }: ProductInfoProps) {
  const stockInfo = getStockInfo(producto);

  // Mismas reglas que ProductCard: lista activa, oferta/campaña/destacado
  const precioSinImpuestos = getPrecioSinImpuestos(producto);
  const precioFinalCalculado = getPrecioConImpuestos(producto);
  const precioFinal = precioFinalCalculado ?? 0;
  const listaActiva = producto.lista_activa;
  const esOferta = listaActiva?.es_oferta === true;
  const esCampanya = listaActiva?.es_campanya === true;
  const esDestacado = producto.destacado;

  // Precio tachado: lista Venta cuando la activa no es Venta (backend envía precio_venta_referencia)
  const precioTachado =
    producto.precio_venta_referencia != null && producto.precio != null && producto.precio_venta_referencia > producto.precio
      ? producto.precio_venta_referencia
      : null;
  const precioOriginal =
    precioTachado == null &&
    producto.precio_minorista &&
    producto.precio != null &&
    producto.precio < producto.precio_minorista
      ? producto.precio_minorista
      : null;
  const mostrarTachado = precioTachado ?? precioOriginal;
  const porcentajeOff =
    mostrarTachado != null && precioFinal > 0 && mostrarTachado > precioFinal
      ? Math.round((1 - precioFinal / mostrarTachado) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-5"
    >
      {/* Nombre del producto */}
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-terciario mb-2 capitalize">
          {producto.nombre || "Producto sin nombre"}
        </h1>
        {producto.modelo?.trim() && (
          <p className="text-sm sm:text-base text-terciario/70 mb-2">
            {producto.modelo.trim()}
          </p>
        )}
        {/* SKU y Marca */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-terciario/50">
          {producto.cod_sku && (
            <span>SKU: <span className="text-terciario">{producto.cod_sku}</span></span>
          )}
          {producto.marca?.nombre && (
            <span className="capitalize">{producto.marca.nombre}</span>
          )}
        </div>
      </div>

      {/* Precio (misma lógica visual que ProductCard: oferta=amber, campaña=emerald, resto=principal) */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
          <span
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              esOferta ? "text-amber-600" : esCampanya ? "text-emerald-700" : "text-principal"
            }`}
          >
            {formatCurrencyARS(precioFinal)}
          </span>
          {mostrarTachado != null && (
            <>
              <span className="text-base sm:text-lg text-terciario/40 line-through">
                {formatCurrencyARS(mostrarTachado)}
              </span>
              {porcentajeOff > 0 && (
                <span className="text-sm font-semibold text-amber-600">
                  {porcentajeOff}% OFF
                </span>
              )}
            </>
          )}
        </div>
        {precioSinImpuestos != null && precioSinImpuestos > 0 && (
          <p className="text-xs sm:text-sm text-terciario/60">
            Sin impuestos: {formatCurrencyARS(precioSinImpuestos)}
          </p>
        )}

        {producto.precio_mayorista && (
          <p className="text-xs sm:text-sm text-terciario/50">
            Precio mayorista: <span className="text-terciario">{formatPrecio(producto.precio_mayorista)}</span>
          </p>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <Package className="w-4 h-4 text-terciario/50 flex-shrink-0" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-terciario/70">Stock:</span>
            <span className={`text-xs font-medium ${stockInfo.cantidad > 0 ? 'text-principal' : 'text-red-600'}`}>
              {stockInfo.label}
            </span>
          </div>
        </div>
      </div>

      {/* Badges (mismo criterio que ProductCard: Oferta, Campaña, Destacado, Financiación) */}
      <div className="flex flex-wrap gap-2">
        {esOferta && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 text-white rounded-md text-xs font-semibold">
            <Tag className="w-3 h-3" />
            <span>Oferta</span>
          </div>
        )}
        {esCampanya && !esOferta && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 text-white rounded-md text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Campaña</span>
          </div>
        )}
        {esDestacado && (
          <div className="flex items-center gap-1 px-2 py-1 bg-principal/10 text-principal rounded-full text-xs font-medium">
            <FaStar className="w-3 h-3" />
            <span>Destacado</span>
          </div>
        )}
        {producto.financiacion && (
          <div className="flex items-center gap-1 px-2 py-1 bg-secundario/10 text-secundario rounded-full text-xs font-medium">
            <CreditCard className="w-3 h-3" />
            <span>Financiación</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

