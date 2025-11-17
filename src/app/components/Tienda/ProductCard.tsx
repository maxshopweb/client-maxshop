import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import type { IProductos } from "@/app/types/producto.type";

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

  return (
    <div className="group bg-white dark:bg-secundario rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-white/10 hover:scale-105 flex flex-col h-full">
      {/* Imagen del Producto */}
      <div className="relative aspect-square bg-gray-100 dark:bg-terciario overflow-hidden">
        {/* Badge de Descuento */}
        {tieneDescuento && porcentajeDescuento > 0 && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-principal text-white px-2 md:px-3 py-0.5 md:py-1 rounded-full font-bold text-xs md:text-sm z-10 shadow-lg">
            -{porcentajeDescuento}%
          </div>
        )}

        {/* Badge de Destacado */}
        {producto.destacado && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-yellow-500 text-terciario px-2 md:px-3 py-0.5 md:py-1 rounded-full font-bold text-[10px] md:text-xs z-10 shadow-lg">
            ⭐ DESTACADO
          </div>
        )}

        {/* Imagen */}
        {producto.img_principal ? (
          <img
            src={producto.img_principal}
            alt={producto.nombre || "Producto"}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🛠️
          </div>
        )}

        {/* Overlay con botón al hacer hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
          <Link
            href={`/tienda/productos/${producto.id_prod}`}
            className="bg-principal hover:bg-principal/90 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-lg font-semibold text-sm md:text-base flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 touch-manipulation"
          >
            <ShoppingCart size={16} className="md:w-[18px] md:h-[18px]" />
            Ver Detalles
          </Link>
        </div>
      </div>

      {/* Información del Producto */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-0.5 md:gap-1 mb-1.5 md:mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className="md:w-4 md:h-4 fill-principal text-principal"
            />
          ))}
        </div>

        {/* Nombre del Producto */}
        <Link href={`/tienda/productos/${producto.id_prod}`}>
          <h3 className="font-bold text-base md:text-lg text-text hover:text-principal transition-colors line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] mb-1.5 md:mb-2 leading-tight">
            {producto.nombre || "Producto sin nombre"}
          </h3>
        </Link>

        {/* Marca */}
        {producto.marca && (
          <p className="text-xs text-text/60 mb-2">
            {producto.marca.nombre}
          </p>
        )}

        {/* Precio */}
        <div className="mt-auto">
          {tieneDescuento ? (
            <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
              <span className="text-2xl md:text-3xl font-extrabold text-principal drop-shadow-sm">
                ${precioFinal.toFixed(2)}
              </span>
              <span className="text-sm md:text-base text-text/50 line-through font-medium">
                ${precioMinorista.toFixed(2)}
              </span>
            </div>
          ) : (
            <span className="text-2xl md:text-3xl font-extrabold text-principal drop-shadow-sm">
              ${precioFinal.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock */}
        {producto.stock !== null && producto.stock !== undefined && (
          <div className="mt-2">
            {producto.stock > 0 ? (
              <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                ✓ Stock disponible ({producto.stock})
              </p>
            ) : (
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                ✗ Sin stock
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

