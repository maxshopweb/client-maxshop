"use client";

import { Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/app/stores/cartStore";
import ProductCart from "../ProductCart";
import CartSummary from "../CartSummary";
import ConfirmModal from "../../modals/ConfirmModal";
import { useState } from "react";

export default function Step1CartConfirmation() {
  const { items, clearCart } = useCartStore();
  
  // Estados para modales de confirmación
  const [showClearModal, setShowClearModal] = useState(false);

  const handleVaciarCarrito = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-foreground/60">No hay productos en el carrito</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <div className="bg-card rounded-xl p-6 shadow-sm mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-principal" />
                <h3 className="text-xl font-semibold text-foreground">
                  Productos en tu carritooo
                </h3>
                <span className="bg-principal/10 text-principal text-xs font-semibold px-2.5 py-1 rounded-full">
                  {items.length} {items.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
              {items.length > 0 && (
                <button
                  onClick={handleVaciarCarrito}
                  className="text-sm font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 px-4 py-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Vaciar
                </button>
              )}
            </div>
          </div>

          {/* Lista de productos */}
          <div className="space-y-3">
            {items.map((item) => (
              <ProductCart 
                key={item.id_prod}
                item={item} 
                readOnly={false}
                variant="md"
              />
            ))}
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>

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

