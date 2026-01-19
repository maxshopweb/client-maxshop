"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Home } from "lucide-react";
import { IProductos } from "@/app/types/producto.type";

interface ProductBreadcrumbsProps {
  producto: IProductos;
}

export default function ProductBreadcrumbs({ producto }: ProductBreadcrumbsProps) {
  const breadcrumbs = [
    { label: "Inicio", href: "/", icon: Home },
    ...(producto.categoria?.nombre
      ? [
          {
            label: "Catálogo",
            href: `/tienda/productos?categoria=${producto.categoria.id_cat}`,
          },
        ]
      : []),
    ...(producto.subcategoria?.nombre
      ? [
          {
            label: producto.subcategoria.nombre,
            href: `/tienda/productos?subcategoria=${producto.subcategoria.id_subcat}`,
          },
        ]
      : []),
    { label: producto.nombre || "Producto", href: "#", isLast: true },
  ];

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs sm:text-sm">
        {breadcrumbs.map((crumb, index) => {
          const Icon = crumb.icon;
          const isLast = crumb.isLast || index === breadcrumbs.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              {index > 0 && (
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-terciario/30" />
              )}
              {isLast ? (
                <span className="text-terciario font-medium truncate max-w-[150px] sm:max-w-[200px]">
                  {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-terciario/60 hover:text-principal transition-colors flex items-center gap-1"
                >
                  {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span>{crumb.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

