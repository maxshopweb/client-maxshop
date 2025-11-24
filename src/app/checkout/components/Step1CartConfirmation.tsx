"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useCheckoutStore, CartItem } from "../hooks/useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import ProductImage from "@/app/components/shared/ProductImage";
import { Button } from "@/app/components/ui/Button";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function Step1CartConfirmation() {
  const { cartItems, setCartItems, setCurrentStep, completeStep } = useCheckoutStore();
  const { items } = useCartStore();

  // Sincronizar items del carrito con el checkout store
  useEffect(() => {
    const formattedItems: CartItem[] = items.map((item) => ({
      id: item.id_prod,
      nombre: item.producto?.nombre || "Producto sin nombre",
      precio: item.precio_unitario || 0,
      cantidad: item.cantidad || 1,
      img_principal: item.producto?.img_principal || "",
      subtotal: item.subtotal || 0,
    }));
    setCartItems(formattedItems);
  }, [items, setCartItems]);

  const handleContinue = () => {
    if (cartItems.length > 0) {
      completeStep(1);
      setCurrentStep(2);
    }
  };

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
        <p className="text-lg text-foreground/60">No hay productos en el carrito</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Productos en tu carrito</h2>

      <div className="space-y-4">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex gap-4 p-4 rounded-xl"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            {/* Imagen */}
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-input/30">
              <ProductImage
                imgPrincipal={item.img_principal}
                nombre={item.nombre}
                className="p-2"
                size="sm"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1 truncate">{item.nombre}</h3>
              <p className="text-sm text-foreground/60 mb-2">
                Cantidad: {item.cantidad} × ${item.precio.toFixed(2)}
              </p>
              <p className="text-lg font-bold text-principal">
                ${item.subtotal.toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Botones */}
      <div className="pt-4 flex gap-4">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => window.location.href = "/"}
          className="rounded-lg flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleContinue}
          className="rounded-lg flex-1"
        >
          Continuar
        </Button>
      </div>
    </motion.div>
  );
}

