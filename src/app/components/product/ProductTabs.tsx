"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IProductos } from "@/app/types/producto.type";
import { Package, Truck, RotateCcw, FileText } from "lucide-react";

interface ProductTabsProps {
  producto: IProductos;
}

type TabType = "description" | "specs" | "shipping" | "returns";

export default function ProductTabs({ producto }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<TabType>("description");

  const tabs = [
    { id: "description" as TabType, label: "Descripción", icon: FileText },
    { id: "specs" as TabType, label: "Especificaciones", icon: Package },
    { id: "shipping" as TabType, label: "Envíos", icon: Truck },
    { id: "returns" as TabType, label: "Devoluciones", icon: RotateCcw },
  ];

  const tabContent = {
    description: (
      <div className="space-y-4">
        {producto.descripcion ? (
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
              {producto.descripcion}
            </p>
          </div>
        ) : (
          <p className="text-foreground/60 italic">No hay descripción disponible para este producto.</p>
        )}
      </div>
    ),
    specs: (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {producto.cod_sku && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">SKU</dt>
              <dd className="text-foreground font-semibold">{producto.cod_sku}</dd>
            </div>
          )}
          {producto.id_interno && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">Código Interno</dt>
              <dd className="text-foreground font-semibold">{producto.id_interno}</dd>
            </div>
          )}
          {producto.modelo && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">Modelo</dt>
              <dd className="text-foreground font-semibold">{producto.modelo}</dd>
            </div>
          )}
          {producto.marca?.nombre && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">Marca</dt>
              <dd className="text-foreground font-semibold">{producto.marca.nombre}</dd>
            </div>
          )}
          {producto.categoria?.nombre && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">Categoría</dt>
              <dd className="text-foreground font-semibold">{producto.categoria.nombre}</dd>
            </div>
          )}
          {producto.subcategoria?.nombre && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">Subcategoría</dt>
              <dd className="text-foreground font-semibold">{producto.subcategoria.nombre}</dd>
            </div>
          )}
          {producto.unidad_medida && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">Unidad de Medida</dt>
              <dd className="text-foreground font-semibold">{producto.unidad_medida}</dd>
            </div>
          )}
          {producto.codi_barras && (
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <dt className="text-sm font-medium text-foreground/70 mb-1">Código de Barras</dt>
              <dd className="text-foreground font-semibold">{producto.codi_barras}</dd>
            </div>
          )}
        </div>
      </div>
    ),
    shipping: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Opciones de Envío</h3>
          <div className="space-y-3">
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-principal mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Envío Estándar</h4>
                  <p className="text-sm text-foreground/70 mb-2">
                    Entrega en 5-7 días hábiles
                  </p>
                  <p className="text-sm font-medium text-principal">
                    $2.000 - Gratis en compras superiores a $50.000
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-principal mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">Envío Express</h4>
                  <p className="text-sm text-foreground/70 mb-2">
                    Entrega en 24-48 horas
                  </p>
                  <p className="text-sm font-medium text-principal">
                    $5.000
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-principal/10 rounded-lg border border-principal/20">
          <p className="text-sm text-foreground/80">
            <strong>Nota:</strong> Los tiempos de entrega pueden variar según la ubicación. 
            Te notificaremos cuando tu pedido sea enviado.
          </p>
        </div>
      </div>
    ),
    returns: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Política de Devoluciones</h3>
          <div className="space-y-3">
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <h4 className="font-semibold text-foreground mb-2">Período de Devolución</h4>
              <p className="text-sm text-foreground/70">
                Tienes 30 días desde la fecha de recepción para devolver el producto.
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <h4 className="font-semibold text-foreground mb-2">Condiciones</h4>
              <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                <li>El producto debe estar en su estado original</li>
                <li>Debe incluir todos los accesorios y embalaje original</li>
                <li>No debe tener signos de uso o daños</li>
              </ul>
            </div>
            <div className="p-4 bg-card rounded-lg border border-card-border">
              <h4 className="font-semibold text-foreground mb-2">Proceso de Devolución</h4>
              <ol className="text-sm text-foreground/70 space-y-1 list-decimal list-inside">
                <li>Contacta con nuestro servicio al cliente</li>
                <li>Te proporcionaremos una etiqueta de envío</li>
                <li>Empaqueta el producto y envíalo de vuelta</li>
                <li>Procesaremos el reembolso en 5-7 días hábiles</li>
              </ol>
            </div>
          </div>
        </div>
        <div className="p-4 bg-principal/10 rounded-lg border border-principal/20">
          <p className="text-sm text-foreground/80">
            <strong>Garantía:</strong> Todos nuestros productos incluyen garantía del fabricante. 
            Para más información, contacta con nuestro servicio al cliente.
          </p>
        </div>
      </div>
    ),
  };

  return (
    <div className="w-full">
      {/* Tabs Navigation */}
      <div className="border-b border-dotted border-card-border mb-6">
        <div className="flex flex-wrap gap-2 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  isActive
                    ? "border-principal text-principal"
                    : "border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/30"
                }`}
                aria-selected={isActive}
                role="tab"
              >
                <Icon className="w-4 h-4" />
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

