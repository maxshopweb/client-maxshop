"use client";

import { useMemo } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import ProductCart from "@/app/components/cart/ProductCart";

export default function CartSummary() {
  const { cartItems, costoEnvio, tipoEntrega, codigoPostal } = useCheckoutStore();
  const isMutatingEnvio = useIsMutating({ mutationKey: ["cotizarEnvio"] });

  const isCalculandoEnvio = useMemo(
    () =>
      tipoEntrega === "envio" &&
      !!codigoPostal &&
      (costoEnvio === null || costoEnvio === undefined) &&
      isMutatingEnvio > 0,
    [tipoEntrega, codigoPostal, costoEnvio, isMutatingEnvio]
  );

  // Calcular totales
  const { subtotal, iva, envio, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = sub * 0.21; // IVA 21%
    const env = costoEnvio || 0;
    const tot = sub + tax + env;
    return {
      subtotal: sub,
      iva: tax,
      envio: env,
      total: tot,
    };
  }, [cartItems, costoEnvio]);

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
          >
            <ProductCart 
              item={item} 
              readOnly={true}
              variant="sm"
            />
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
          <span className="text-foreground/70">Subtotal (sin IVA)</span>
          <span className="text-foreground font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">IVA (21%)</span>
          <span className="text-foreground font-medium">${iva.toFixed(2)}</span>
        </div>
        {tipoEntrega === "envio" && (
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Costo de envío</span>
            {isCalculandoEnvio ? (
              <span className="text-foreground/50 text-xs">Calculando...</span>
            ) : costoEnvio !== null && costoEnvio > 0 ? (
              <span className="text-foreground font-medium">${envio.toFixed(2)}</span>
            ) : (
              <span className="text-foreground/50 text-xs">-</span>
            )}
          </div>
        )}
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
          {isCalculandoEnvio ? (
            <span className="text-foreground/70 text-base font-medium">Calculando...</span>
          ) : (
            `$${total.toFixed(2)}`
          )}
        </span>
      </div>
    </div>
  );
}

