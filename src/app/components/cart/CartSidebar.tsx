"use client";

import { X, ShoppingBag, Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/app/stores/cartStore";
import { Button } from "../ui/Button";
import ConfirmModal from "../modals/ConfirmModal";
import { useRef } from "react";
import { useHandleCart } from "@/app/hooks/useHandleCart";
import ProductCart from "./ProductCart";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, summary } = useCartStore();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const {
    handleVerCarrito,
    handleVaciarCarrito,
    confirmClearCart,
    showClearModal,
    closeClearModal,
  } = useHandleCart(onClose);

  return (
    <>
      {/* Overlay - Cubre toda la pantalla desde arriba */}
      <div
        className={`fixed inset-0 bg-black/70 z-[100] transition-all duration-500 ease-in-out ${isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      {/* Sidebar - Empieza desde arriba (top: 0), color fijo que no cambia con scroll */}
      <div
        ref={sidebarRef}
        className={`fixed right-0 top-0 w-1/4 min-w-[440px] max-w-md h-full shadow-2xl z-[110] transform transition-all duration-500 ease-in-out ${isOpen
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
          }`}
        style={{
          backgroundColor: 'var(--sidebar-bg)', // Color fijo basado en tema, no cambia con scroll
          backdropFilter: 'none'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-input bg-card z-10">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6 text-principal" />
              <h2 className="text-xl font-semibold text-foreground">Mi Carrito</h2>
              {summary.cantidadItems > 0 && (
                <span className="bg-principal text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {summary.cantidadItems}
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2.5 hover:bg-input rounded-lg transition-colors flex items-center justify-center border border-input hover:border-principal/50"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-foreground/20 mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">
                  Tu carrito está vacío
                </p>
                <p className="text-sm text-foreground/60 mb-6">
                  Agrega productos para comenzar
                </p>
                <Button variant="primary" onClick={onClose}>
                  Seguir comprando
                </Button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {items.map((item) => (
                  <ProductCart
                    key={item.id_prod}
                    item={item}
                    variant="md"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer con resumen */}
          {items.length > 0 && (
            <div className="border-t border-input bg-background">
              {/* Resumen */}
              <div className="px-6 py-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Subtotal</span>
                  <span className="text-foreground font-medium">
                    ${summary.subtotal.toFixed(2)}
                  </span>
                </div>
                {summary.descuentos > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Descuentos</span>
                    <span className="text-principal font-medium">
                      -${summary.descuentos.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Envío</span>
                  <span className="text-foreground font-medium">
                    {summary.envio === 0 ? (
                      <span className="text-principal">-</span>
                    ) : (
                      `$${summary.envio.toFixed(2)}`
                    )}
                  </span>
                </div>

                {/* Línea divisoria full width */}
                <div className="border-t border-input -mx-6"></div>

                <div className="pt-2 flex justify-between">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-principal">
                    ${summary.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="px-6 pb-4 space-y-2">
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleVerCarrito}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ver Carrito
                </Button>
                <Button
                  onClick={handleVaciarCarrito}
                  className="w-full flex items-center justify-center gap-2"
                  variant="outline-primary"
                >
                  <Trash2 className="w-4 h-4" />
                  Vaciar Carrito
                </Button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 text-sm font-medium text-foreground hover:text-foreground/80 transition-all duration-200 decoration-foreground/30 hover:decoration-foreground/60 underline-offset-4"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearModal}
        onClose={closeClearModal}
        onConfirm={confirmClearCart}
        title="¿Vaciar carrito?"
        description="¿Estás seguro que deseas eliminar todos los productos del carrito? Esta acción no se puede deshacer."
        type="warning"
        confirmText="Vaciar carrito"
        cancelText="Cancelar"
      />
    </>
  );
}

