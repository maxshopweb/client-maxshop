"use client";

import { motion } from "framer-motion";
import { Star, Package, Award, CreditCard } from "lucide-react";
import { IProductos } from "@/app/types/producto.type";
import { formatPrecio, getStockInfo } from "@/app/types/producto.type";

interface ProductInfoProps {
  producto: IProductos;
}

export default function ProductInfo({ producto }: ProductInfoProps) {
  const stockInfo = getStockInfo(producto);
  
  // Calcular precio a mostrar
  const precioFinal = producto.precio || producto.precio_minorista || 0;
  const precioOriginal = producto.precio_minorista && producto.precio && producto.precio < producto.precio_minorista
    ? producto.precio_minorista
    : null;
  
  const descuento = precioOriginal
    ? Math.round(((precioOriginal - precioFinal) / precioOriginal) * 100)
    : 0;

  // Verificar si hay precio de evento
  const tienePrecioEvento = producto.precio_evento && producto.precio_evento < precioFinal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Nombre del producto */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {producto.nombre || "Producto sin nombre"}
        </h1>
        
        {/* SKU y Marca */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/70">
          {producto.cod_sku && (
            <span>SKU: <strong className="text-foreground">{producto.cod_sku}</strong></span>
          )}
          {producto.marca?.nombre && (
            <span>Marca: <strong className="text-foreground">{producto.marca.nombre}</strong></span>
          )}
        </div>
      </div>

      {/* Rating (placeholder - se puede conectar con sistema de reviews) */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
          ))}
        </div>
        <span className="text-sm text-foreground/70">(4.5) - 12 reseñas</span>
      </div>

      {/* Precio */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-4xl md:text-5xl font-bold text-principal">
            {formatPrecio(precioFinal)}
          </span>
          {precioOriginal && descuento > 0 && (
            <>
              <span className="text-2xl text-foreground/50 line-through">
                {formatPrecio(precioOriginal)}
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                -{descuento}%
              </span>
            </>
          )}
        </div>
        
        {tienePrecioEvento && producto.precio_evento && (
          <div className="flex items-center gap-2 text-principal">
            <Award className="w-5 h-5" />
            <span className="text-sm font-medium">
              Precio especial de evento disponible
            </span>
          </div>
        )}

        {producto.precio_mayorista && (
          <p className="text-sm text-foreground/70">
            Precio mayorista: <strong className="text-foreground">{formatPrecio(producto.precio_mayorista)}</strong>
          </p>
        )}
      </div>

      {/* Stock */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Package className="w-5 h-5 text-foreground/70" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-foreground">Stock disponible:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold border ${stockInfo.color}`}>
                {stockInfo.label}
              </span>
            </div>
            <p className="text-sm text-foreground/70">
              {stockInfo.cantidad > 0
                ? `${stockInfo.cantidad} unidades disponibles`
                : "Producto sin stock"}
            </p>
            {stockInfo.cantidad > 0 && stockInfo.cantidad < 5 && (
              <p className="text-sm text-principal font-medium mt-1">
                ⚠️ Últimas unidades disponibles
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {producto.destacado && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-3 py-1 bg-principal/10 text-principal rounded-full text-sm font-medium"
          >
            <Star className="w-4 h-4 fill-principal" />
            <span>Destacado</span>
          </motion.div>
        )}
        {producto.financiacion && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-3 py-1 bg-secundario/10 text-secundario rounded-full text-sm font-medium"
          >
            <CreditCard className="w-4 h-4" />
            <span>Financiación disponible</span>
          </motion.div>
        )}
      </div>

      {/* Descripción corta */}
      {producto.descripcion && (
        <div className="pt-4 border-t border-dotted border-card-border">
          <p className="text-foreground/80 leading-relaxed line-clamp-3">
            {producto.descripcion}
          </p>
        </div>
      )}
    </motion.div>
  );
}

