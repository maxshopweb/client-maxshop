"use client";

import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/app/stores/cartStore";
import ProductImage from "../../shared/ProductImage";
import CartSummary from "../CartSummary";
import ConfirmModal from "../../modals/ConfirmModal";
import { useState } from "react";

export default function Step1CartConfirmation() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  
  // Estados para modales de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

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
                  Productos en tu carrito
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
            {items.map((item) => {
              const descuento = item.descuento || 0;
              const tieneDescuento = descuento > 0;
              const porcentajeDescuento = tieneDescuento && item.precio_unitario
                ? Math.round((descuento / (item.precio_unitario * item.cantidad + descuento)) * 100)
                : 0;

              return (
                <div
                  key={item.id_prod}
                  className="group bg-card rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex gap-4 p-5">
                {/* Imagen */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gradient-to-br from-background to-background/50 rounded-lg overflow-hidden">
                  <ProductImage
                    imgPrincipal={item.producto.img_principal}
                    codiArti={item.producto.codi_arti}
                    nombre={item.producto.nombre}
                    className="p-3"
                    size="md"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col">
                  {/* Nombre y marca */}
                  <div className="mb-3">
                    <h3 className="text-base md:text-lg font-semibold text-foreground mb-1 leading-tight capitalize">
                      {item.producto.nombre || "Producto sin nombre"}
                    </h3>
                    {item.producto.marca && (
                      <p className="text-xs text-foreground/50 capitalize">
                        {item.producto.marca.nombre}
                      </p>
                    )}
                  </div>

                  {/* Precio */}
                  <div className="mb-4">
                    {tieneDescuento ? (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-xl md:text-2xl font-bold text-principal">
                          ${item.subtotal.toFixed(2)}
                        </span>
                        <span className="text-sm text-foreground/40 line-through">
                          ${(item.precio_unitario * item.cantidad + descuento).toFixed(2)}
                        </span>
                        <span className="text-xs bg-principal/10 text-principal px-2 py-1 rounded-full font-semibold">
                          -{porcentajeDescuento}% OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl md:text-2xl font-bold text-principal">
                        ${item.subtotal.toFixed(2)}
                      </span>
                    )}
                    <p className="text-sm text-foreground/50 mt-1">
                      ${item.precio_unitario.toFixed(2)} c/u
                    </p>
                  </div>

                  {/* Controles alineados */}
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-1.5 bg-input/50 rounded-lg p-0.5">
                      <button
                        onClick={() => handleDecrementar(item.id_prod, item.cantidad)}
                        className="p-1.5 hover:bg-input rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="w-3.5 h-3.5 text-foreground" />
                      </button>
                      <span className="text-sm font-semibold text-foreground w-8 text-center">
                        {item.cantidad}
                      </span>
                      <button
                        onClick={() => handleIncrementar(item.id_prod, item.cantidad)}
                        className="p-1.5 hover:bg-input rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="w-3.5 h-3.5 text-foreground" />
                      </button>
                    </div>

                    {/* Eliminar */}
                    <button
                      onClick={() => handleEliminarItem(item.id_prod)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-all duration-200 text-destructive hover:text-destructive/80 active:scale-95"
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
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <CartSummary />
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
        description="¿Estás seguro que deseas eliminar este producto del carrito?"
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

