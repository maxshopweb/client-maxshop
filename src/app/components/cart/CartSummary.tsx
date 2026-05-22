"use client";

import { useMemo } from "react";
import { useCartStore } from "@/app/stores/cartStore";
import { formatCurrencyARS } from "@/app/utils/currency";

export default function CartSummary() {
  const { summary } = useCartStore();

  const subtotalLista = useMemo(
    () => summary.subtotal + (summary.descuentos > 0 ? summary.descuentos : 0),
    [summary.subtotal, summary.descuentos]
  );

  return (
    <div className="bg-card rounded-xl p-6 sticky top-6 lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-foreground mb-6">Resumen del pedido</h3>
      
      <div className="space-y-3 mb-6">
        {summary.descuentos > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Subtotal (lista)</span>
              <span className="text-foreground font-medium">
                {formatCurrencyARS(subtotalLista)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-amber-700">
              <span className="text-foreground/70">Bonificación</span>
              <span className="font-medium">
                -{formatCurrencyARS(summary.descuentos)}
              </span>
            </div>
          </>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">
            {summary.descuentos > 0 ? "Subtotal productos" : "Subtotal"}
          </span>
          <span className="text-right text-foreground font-medium">
            {formatCurrencyARS(summary.subtotal)}
            {summary.subtotalSinImpuestos > 0 && (
              <span className="block text-[11px] text-foreground/50">
                Sin impuestos: {formatCurrencyARS(summary.subtotalSinImpuestos)}
              </span>
            )}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-foreground/70">Envío</span>
          <span className="text-foreground font-medium">
            {summary.envio === 0 ? (
              <span className="text-principal">Gratis</span>
            ) : (
              formatCurrencyARS(summary.envio)
            )}
          </span>
        </div>
      </div>
      
      <div className="border-t border-input/30 pt-4 flex justify-between">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-right text-2xl font-bold text-principal">
          {formatCurrencyARS(summary.total)}
          {summary.totalSinImpuestos > 0 && (
            <span className="block text-[12px] text-foreground/60 font-medium">
              Sin impuestos: {formatCurrencyARS(summary.totalSinImpuestos)}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
