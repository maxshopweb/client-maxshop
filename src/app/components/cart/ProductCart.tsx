"use client";

import { Trash2, Plus, Minus } from "lucide-react";
import ProductImage from "../shared/ProductImage";
import { ICartItem } from "@/app/types/cart.type";
import { CartItem } from "@/app/hooks/checkout/useCheckoutStore";
import ConfirmModal from "../modals/ConfirmModal";
import { useHandleCart } from "@/app/hooks/useHandleCart";
import { useNormalizeProduct } from "@/app/hooks/useNormalizeProduct";

interface ProductCartProps {
  // Puede recibir ICartItem (del cartStore) o CartItem (del checkoutStore)
  item: ICartItem | CartItem;
  // Modo lectura (sin acciones)
  readOnly?: boolean;
  // Variante de tamaño: 'sm' para resumen, 'md' para carrito principal
  variant?: 'sm' | 'md';
  // Callback opcional cuando se actualiza (para sincronizar checkout)
  onUpdate?: () => void;
}

export default function ProductCart({
  item: product,
  readOnly = false,
  variant = 'md',
  onUpdate
}: ProductCartProps) {

  const {
    handleEliminarItem,
    confirmDeleteItem,
    showDeleteModal,
    itemToDelete,
    closeDeleteModal,
    incrementar,
    decrementar
  } = useHandleCart();

  const { 
    id_prod, 
    nombre, 
    img_principal, 
    codi_arti, 
    marca, 
    cantidad, 
    precio_unitario, 
    subtotal, 
    descuento, 
    porcentajeDescuento,
    tieneDescuento
  } = useNormalizeProduct({ product });

  // Verificar si este item es el que se está eliminando
  const isDeleting = itemToDelete === id_prod;

  // Variante pequeña para resumen (solo lectura)
  if (variant === 'sm' || readOnly) {
    return (
      <div className="flex items-start gap-3 text-sm">
        {/* Imagen del producto */}
        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-input/30">
          <ProductImage
            imgPrincipal={img_principal}
            codiArti={codi_arti}
            nombre={nombre}
            className="p-2"
            size="sm"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate capitalize">{nombre}</p>
          {marca && (
            <p className="text-xs text-foreground/50 capitalize">{marca.nombre}</p>
          )}
          <p className="text-foreground/60 text-xs mt-1">
            {cantidad} × ${precio_unitario.toFixed(2)}
          </p>
        </div>
        <p className="font-semibold text-foreground flex-shrink-0">
          ${subtotal.toFixed(2)}
        </p>
      </div>
    );
  }

  // Variante mediana para carrito principal (con acciones)
  return (
    <>
      <div className="group bg-card rounded-xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md">
        <div className="flex gap-3 p-3">
          {/* Imagen */}
          <div className="relative w-20 h-20 flex-shrink-0 bg-gradient-to-br from-background to-background/50 rounded-lg overflow-hidden">
            <ProductImage
              imgPrincipal={img_principal}
              codiArti={codi_arti}
              nombre={nombre}
              className="p-2"
              size="sm"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Nombre y marca */}
            <div className="mb-2">
              <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-0.5 leading-tight capitalize">
                {nombre}
              </h3>
              {marca && (
                <p className="text-xs text-foreground/50 capitalize">
                  {marca.nombre}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="mb-2">
              {tieneDescuento ? (
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-base font-bold text-principal">
                    ${subtotal.toFixed(2)}
                  </span>
                  <span className="text-xs text-foreground/40 line-through">
                    ${(precio_unitario * cantidad + descuento).toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-base font-bold text-principal">
                  ${subtotal.toFixed(2)}
                </span>
              )}
              <p className="text-xs text-foreground/50 mt-0.5">
                ${precio_unitario.toFixed(2)} c/u
              </p>
            </div>

            {/* Controles alineados */}
            <div className="flex items-center justify-between gap-2 mt-auto">
              {/* Controles de cantidad */}
              <div className="flex items-center gap-1.5 bg-input/50 rounded-lg p-0.5">
                <button
                  onClick={() => {
                    if (!readOnly) {
                      decrementar(id_prod, cantidad);
                      onUpdate?.();
                    }
                  }}
                  className="p-1.5 hover:bg-input rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center border border-transparent hover:border-principal/30"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="w-3.5 h-3.5 text-foreground" />
                </button>
                <span className="text-sm font-semibold text-foreground w-8 text-center">
                  {cantidad}
                </span>
                <button
                  onClick={() => {
                    if (!readOnly) {
                      incrementar(id_prod, cantidad);
                      onUpdate?.();
                    }
                  }}
                  className="p-1.5 hover:bg-input rounded-md transition-all duration-200 active:scale-95 flex items-center justify-center border border-transparent hover:border-principal/30"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="w-3.5 h-3.5 text-foreground" />
                </button>
              </div>

              {/* Eliminar */}
              <button
                onClick={() => {
                  if (!readOnly) {
                    handleEliminarItem(id_prod);
                  }
                }}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-all duration-200 text-destructive hover:text-destructive/80 active:scale-95 border border-transparent hover:border-destructive/20"
                aria-label="Eliminar producto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar producto - solo se muestra para este item */}
      {isDeleting && (
        <ConfirmModal
          isOpen={showDeleteModal && isDeleting}
          onClose={closeDeleteModal}
          onConfirm={() => {
            confirmDeleteItem();
            onUpdate?.();
          }}
          title="¿Eliminar producto?"
          description="¿Estás seguro que deseas eliminar este producto del carrito?"
          type="warning"
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </>
  );
}

