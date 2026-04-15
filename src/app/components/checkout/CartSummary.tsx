"use client";

import { useMemo } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import ProductCart from "@/app/components/cart/ProductCart";
import { formatCurrencyARS } from "@/app/utils/currency";

export default function CartSummary() {
  const { cartItems, costoEnvio, tipoEntrega, codigoPostal } = useCheckoutStore();
  const isMutatingEnvio = useIsMutating({ mutationKey: ["cotizarEnvio"] });
  const isAndreaniManualMode = process.env.NEXT_PUBLIC_ANDREANI_MODO_MANUAL === "true";

  const isCalculandoEnvio = useMemo(
    () =>
      tipoEntrega === "envio" &&
      !!codigoPostal &&
      (costoEnvio === null || costoEnvio === undefined) &&
      isMutatingEnvio > 0,
    [tipoEntrega, codigoPostal, costoEnvio, isMutatingEnvio]
  );

  // Calcular totales
  const { subtotal, subtotalSinImpuestos, impuestos, envio, total, totalSinImpuestos } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const subSinImp = cartItems.reduce((sum, item) => sum + (item.subtotalSinImpuestos ?? item.subtotal), 0);
    const impuestosCalculados = Math.max(sub - subSinImp, 0);
    const env = costoEnvio || 0;
    const tot = sub + env;
    const totSinImp = subSinImp + env;
    return {
      subtotal: sub,
      subtotalSinImpuestos: subSinImp,
      impuestos: impuestosCalculados,
      envio: env,
      total: tot,
      totalSinImpuestos: totSinImp,
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
          <span className="text-foreground/70">Subtotal</span>
          <div className="text-right">
            <span className="text-foreground font-medium block">{formatCurrencyARS(subtotal)}</span>
            {subtotalSinImpuestos > 0 && (
              <span className="block text-[11px] text-foreground/50">
                Sin impuestos: {formatCurrencyARS(subtotalSinImpuestos)}
              </span>
            )}
          </div>
        </div>
        {tipoEntrega === "envio" && (
          <div className="flex justify-between text-sm">
            <span className="text-foreground/70">Costo de envío</span>
            {isAndreaniManualMode ? (
              <span className="text-foreground/60 text-xs">Se confirmará por WhatsApp/soporte</span>
            ) : isCalculandoEnvio ? (
              <span className="text-foreground/50 text-xs">Calculando...</span>
            ) : costoEnvio !== null && costoEnvio === 0 ? (
              <span className="text-foreground font-medium text-green-600">Envío gratis</span>
            ) : costoEnvio !== null && costoEnvio > 0 ? (
              <span className="text-foreground font-medium">{formatCurrencyARS(envio)}</span>
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
            <>
              {formatCurrencyARS(total)}
              {totalSinImpuestos > 0 && (
                <span className="block text-[11px] text-foreground/50 italic mt-1 font-normal">
                  (Sin impuestos: {formatCurrencyARS(totalSinImpuestos)})
                </span>
              )}
            </>
          )}
        </span>
      </div>
    </div>
  );
}

