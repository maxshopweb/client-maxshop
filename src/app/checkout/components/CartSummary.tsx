"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useCheckoutStore } from "../hooks/useCheckoutStore";
import ProductImage from "@/app/components/shared/ProductImage";

export default function CartSummary() {
  const { cartItems } = useCheckoutStore();

  // Calcular totales
  const { subtotal, iva, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = sub * 0.21; // IVA 21%
    const tot = sub + tax;
    return {
      subtotal: sub,
      iva: tax,
      total: tot,
    };
  }, [cartItems]);

  return (
    <div
      className="rounded-xl p-6 md:sticky md:top-6"
      style={{
        backgroundColor: "var(--white)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <h2 className="text-xl font-bold text-foreground mb-6">Resumen</h2>

      {/* Lista de productos */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
        {cartItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 text-sm"
          >
            {/* Imagen del producto */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-input/30">
              <ProductImage
                imgPrincipal={item.img_principal}
                nombre={item.nombre}
                className="p-2"
                size="sm"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{item.nombre}</p>
              <p className="text-foreground/60 text-xs">
                {item.cantidad} × ${item.precio.toFixed(2)}
              </p>
            </div>
            <p className="font-semibold text-foreground flex-shrink-0">
              ${item.subtotal.toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Separador */}
      <div
        className="border-t mb-4"
        style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}
      />

      {/* Totales */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Subtotal</span>
          <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">IVA (21%)</span>
          <span className="text-foreground font-medium">${iva.toFixed(2)}</span>
        </div>
      </div>

      {/* Separador */}
      <div
        className="border-t mb-4"
        style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}
      />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-lg font-bold text-foreground">Total</span>
        <span
          className="text-2xl font-bold"
          style={{ color: "var(--principal)" }}
        >
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

