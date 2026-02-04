"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useCheckoutStore, CartItem } from "@/app/hooks/checkout/useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import ProductCart from "@/app/components/cart/ProductCart";
import { Button } from "@/app/components/ui/Button";
import { ShoppingCart, ArrowLeft } from "lucide-react";

export default function Step1CartConfirmation() {
  const { cartItems, setCartItems, setCurrentStep, completeStep } = useCheckoutStore();
  const { items } = useCartStore();

  // Sincronizar items del carrito con el checkout store
  const syncCartItems = () => {
    const formattedItems: CartItem[] = items.map((item) => ({
      id: item.id_prod,
      nombre: item.producto?.nombre || "Producto sin nombre",
      precio: item.precio_unitario || 0,
      cantidad: item.cantidad || 1,
      img_principal: item.producto?.img_principal || "",
      subtotal: item.subtotal || 0,
    }));
    setCartItems(formattedItems);
  };

  useEffect(() => {
    syncCartItems();
  }, [items, setCartItems]);

  const handleContinue = () => {
    if (items.length > 0) {
      completeStep(1);
      setCurrentStep(2);
    }
  };

  if (items.length === 0) {
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
      <h2 className="text-2xl font-bold text-foreground/90 mb-6">Productos en tu carrito</h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id_prod}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCart 
              item={item} 
              readOnly={false}
              variant="md"
              onUpdate={syncCartItems}
            />
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

