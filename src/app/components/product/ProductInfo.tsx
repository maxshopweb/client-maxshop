"use client";

import { motion } from "framer-motion";
import { CreditCard, Tag, Box } from "lucide-react";
import { Badge } from "@/app/components/ui/Badge";
import { IProductos } from "@/app/types/producto.type";
import { formatPrecio } from "@/app/types/producto.type";
import { getPrecioSinImpuestos } from "@/app/utils/producto.utils";
import { getPresentacionPrecioProducto } from "@/app/utils/precio-presentacion.utils";
import { formatCurrencyARS } from "@/app/utils/currency";

interface ProductInfoProps {
  producto: IProductos;
}

export default function ProductInfo({ producto }: ProductInfoProps) {
  const sinStock = (producto.stock ?? 0) === 0;
  const isInactive = producto.activo !== "S" && producto.estado !== 1;
  const noDisponible = sinStock || isInactive;

  const precioSinImpuestos = getPrecioSinImpuestos(producto);
  const { precioFinal, precioTachado, mostrarTachado, etiqueta } =
    getPresentacionPrecioProducto(producto);
  const listaActiva = producto.lista_activa;
  const esOferta = listaActiva?.es_oferta === true;
  const esCampanya = listaActiva?.es_campanya === true;

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
        {producto.cod_sku && (
          <p className="text-xs sm:text-sm text-terciario/50">
            SKU: <span className="text-terciario">{producto.cod_sku}</span>
          </p>
        )}
      </div>

      {/* Precio (oferta/campaña colorean el monto; badges promocionales van en la galería) */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
          <span
            className={`text-2xl sm:text-3xl md:text-4xl font-bold ${
              esOferta ? "text-amber-600" : esCampanya ? "text-emerald-700" : "text-principal"
            }`}
          >
            {formatCurrencyARS(precioFinal)}
          </span>
          {mostrarTachado && precioTachado != null && (
            <>
              <span className="text-base sm:text-lg text-terciario/40 line-through">
                {formatCurrencyARS(precioTachado)}
              </span>
              {etiqueta && (
                <span className="text-sm font-semibold text-amber-600">
                  {etiqueta}
                </span>
              )}
            </>
          )}
        </div>
        {precioSinImpuestos != null && precioSinImpuestos > 0 && (
          <p className="text-xs text-terciario/40">
            Sin impuestos: {formatCurrencyARS(precioSinImpuestos)}
          </p>
        )}

        {producto.precio_mayorista && (
          <p className="text-xs sm:text-sm text-terciario/50">
            Precio mayorista: <span className="text-terciario">{formatPrecio(producto.precio_mayorista)}</span>
          </p>
        )}
      </div>

      {noDisponible && (
        <p className="text-sm font-medium text-terciario/80">No disponible</p>
      )}

      {/* Tags: marca, modelo, financiación (oferta/campaña/destacado en galería) */}
      <div className="flex flex-wrap gap-2">
        {producto.marca?.nombre && (
          <Badge variant="principal" className="gap-1.5 px-3 py-1 capitalize">
            <Tag className="w-3 h-3 shrink-0" />
            {producto.marca.nombre}
          </Badge>
        )}
        {producto.modelo?.trim() && (
          <Badge variant="info" className="gap-1.5 px-3 py-1">
            <Box className="w-3 h-3 shrink-0" />
            {producto.modelo.trim()}
          </Badge>
        )}
        {producto.financiacion && (
          <Badge variant="success" className="gap-1.5 px-3 py-1">
            <CreditCard className="w-3 h-3 shrink-0" />
            Financiación
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
