"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IProductos } from "@/app/types/producto.type";
import { Package, FileText } from "lucide-react";

interface ProductTabsProps {
  producto: IProductos;
}

type TabType = "description" | "specs";

export default function ProductTabs({ producto }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  const tabs = [
    { id: "description" as TabType, label: "Descripción", icon: FileText },
    { id: "specs" as TabType, label: "Especificaciones", icon: Package },
  ];

  const tabContent = {
    description: (
      <div className="space-y-3 sm:space-y-4">
        {producto.descripcion ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-sm sm:text-base text-terciario/80 leading-relaxed whitespace-pre-line">
              {producto.descripcion}
            </p>
          </div>
        ) : (
          <p className="text-sm sm:text-base text-terciario/60 italic">No hay descripción disponible para este producto.</p>
        )}
      </div>
    ),
    specs: (
      <div className="space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {producto.cod_sku && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">SKU</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium">{producto.cod_sku}</dd>
            </div>
          )}
          {producto.id_interno && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">Código Interno</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium">{producto.id_interno}</dd>
            </div>
          )}
          {producto.modelo && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">Modelo</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium">{producto.modelo}</dd>
            </div>
          )}
          {producto.marca?.nombre && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">Marca</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium capitalize">{producto.marca.nombre}</dd>
            </div>
          )}
          {producto.categoria?.nombre && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">Categoría</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium capitalize">{producto.categoria.nombre}</dd>
            </div>
          )}
          {producto.subcategoria?.nombre && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">Subcategoría</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium capitalize">{producto.subcategoria.nombre}</dd>
            </div>
          )}
          {producto.unidad_medida && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">Unidad de Medida</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium">{producto.unidad_medida}</dd>
            </div>
          )}
          {producto.codi_barras && (
            <div className="py-2 sm:py-3">
              <dt className="text-xs sm:text-sm font-medium text-terciario/60 mb-1">Código de Barras</dt>
              <dd className="text-sm sm:text-base text-terciario font-medium">{producto.codi_barras}</dd>
            </div>
          )}
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b border-card-border/10 mb-4">
        <div className="flex flex-wrap gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? "border-principal text-principal"
                    : "border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/30"
                }`}
                aria-selected={isActive}
                role="tab"
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          role="tabpanel"
        >
          {tabContent[activeTab]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

