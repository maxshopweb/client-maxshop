"use client";

import { useRouter } from "next/navigation";
import { X, ShoppingBag, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/app/stores/cartStore";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeProvider";
import { Button } from "../ui/Button";
import ProductImage from "../shared/ProductImage";
import ConfirmModal from "../modals/ConfirmModal";
import { useState, useRef } from "react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { actualTheme } = useTheme();
  const { items, summary, removeItem, updateQuantity, clearCart } = useCartStore();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Estados para modales de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleVerCarrito = () => {
    onClose();
    // Resetear checkout al step 1 y redirigir
    router.push("/checkout?step=1");
  };

  const handleEliminarItem = (id_prod: number) => {
    setItemToDelete(id_prod);
    setShowDeleteModal(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete !== null) {
      removeItem(itemToDelete);
      setItemToDelete(null);
    }
    setShowDeleteModal(false);
  };

  const handleVaciarCarrito = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  const handleIncrementar = (id_prod: number, cantidad: number) => {
    updateQuantity(id_prod, cantidad + 1);
  };

  const handleDecrementar = (id_prod: number, cantidad: number) => {
    if (cantidad > 1) {
      updateQuantity(id_prod, cantidad - 1);
    } else {
      handleEliminarItem(id_prod);
    }
  };

  return (
    <>
      {/* Overlay - Cubre toda la pantalla desde arriba */}
      <div
        className={`fixed inset-0 bg-black/70 z-[100] transition-all duration-500 ease-in-out ${
          isOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar - Empieza desde arriba (top: 0), color fijo que no cambia con scroll */}
      <div
        ref={sidebarRef}
        className={`fixed right-0 top-0 w-1/4 min-w-[320px] max-w-md h-full shadow-2xl z-[110] transform transition-all duration-500 ease-in-out ${
          isOpen 
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
                {items.map((item) => {
                  const tieneDescuento = (item.descuento ?? 0) > 0;
                  const porcentajeDescuento = tieneDescuento && item.precio_unitario
                    ? Math.round(((item.descuento ?? 0) / (item.precio_unitario * item.cantidad + (item.descuento ?? 0))) * 100)
                    : 0;

                  return (
                    <div
                      key={item.id_prod}
                      className="group bg-card rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <div className="flex gap-3 p-3">
                        {/* Imagen */}
                        <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-background to-background/50 rounded-lg overflow-hidden">
                          <ProductImage
                            imgPrincipal={item.producto.img_principal}
                            codiArti={item.producto.codi_arti}
                            nombre={item.producto.nombre}
                            className="p-2"
                            size="sm"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          {/* Nombre y marca */}
                          <div className="mb-2">
                            <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-0.5 leading-tight capitalize">
                              {item.producto.nombre || "Producto sin nombre"}
                            </h3>
                            {item.producto.marca && (
                              <p className="text-xs text-foreground/50 capitalize">
                                {item.producto.marca.nombre}
                              </p>
                            )}
                          </div>

                          {/* Precio */}
                          <div className="mb-2">
                            {tieneDescuento ? (
                              <div className="flex items-baseline gap-1.5 flex-wrap">
                                <span className="text-base font-bold text-principal">
                                  ${item.subtotal.toFixed(2)}
                                </span>
                                <span className="text-xs text-foreground/40 line-through">
                                  ${(item.precio_unitario * item.cantidad + (item.descuento ?? 0)).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="text-base font-bold text-principal">
                                ${item.subtotal.toFixed(2)}
                              </span>
                            )}
                            <p className="text-xs text-foreground/50 mt-0.5">
                              ${item.precio_unitario.toFixed(2)} c/u
                            </p>
                          </div>

                          {/* Controles alineados */}
                          <div className="flex items-center justify-between gap-2 mt-auto">
                            {/* Controles de cantidad */}
                            <div className="flex items-center gap-1.5 bg-input/50 rounded-lg p-0.5">
                              <button
                                onClick={() => handleDecrementar(item.id_prod, item.cantidad)}
                                className="p-1.5 hover:bg-input rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center border border-transparent hover:border-principal/30"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="w-3.5 h-3.5 text-foreground" />
                              </button>
                              <span className="text-sm font-semibold text-foreground w-8 text-center">
                                {item.cantidad}
                              </span>
                              <button
                                onClick={() => handleIncrementar(item.id_prod, item.cantidad)}
                                className="p-1.5 hover:bg-input rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center border border-transparent hover:border-principal/30"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3.5 h-3.5 text-foreground" />
                              </button>
                            </div>

                            {/* Eliminar */}
                            <button
                              onClick={() => handleEliminarItem(item.id_prod)}
                              className="p-2 hover:bg-destructive/10 rounded-lg transition-all duration-200 text-destructive hover:text-destructive/80 active:scale-95 border border-transparent hover:border-destructive/20"
                              aria-label="Eliminar producto"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer con resumen */}
          {items.length > 0 && (
            <div className="border-t border-input bg-background p-6 space-y-4">
              {/* Resumen */}
              <div className="space-y-2">
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
                      <span className="text-principal">Gratis</span>
                    ) : (
                      `$${summary.envio.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-input pt-2 flex justify-between">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-principal">
                    ${summary.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="space-y-2">
                <button
                  onClick={onClose}
                  className="w-full py-2.5 px-4 text-sm font-medium text-foreground hover:text-foreground/80 transition-all duration-200 underline decoration-foreground/30 hover:decoration-foreground/60 underline-offset-4"
                >
                  Seguir comprando
                </button>
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleVerCarrito}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Ver Carrito
                </Button>
                <button
                  onClick={handleVaciarCarrito}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/30 hover:border-destructive/50 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Vaciar Carrito
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar producto */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteItem}
        title="¿Eliminar producto?"
        description={
          itemToDelete
            ? `¿Estás seguro que deseas eliminar este producto del carrito?`
            : "¿Estás seguro que deseas eliminar este producto del carrito?"
        }
        type="warning"
        confirmText="Eliminar"
        cancelText="Cancelar"
      />

      {/* Modal de confirmación para vaciar carrito */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
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

