"use client";

import { useCartStore } from "@/app/stores/cartStore";

export default function CartSummary() {
  const { summary } = useCartStore();

  return (
    <div className="bg-card rounded-xl p-6 sticky top-6 lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-lg font-semibold text-foreground mb-6">Resumen del pedido</h3>
      
      <div className="space-y-3 mb-6">
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
      </div>
      
      <div className="border-t border-input/30 pt-4 flex justify-between">
        <span className="text-lg font-semibold text-foreground">Total</span>
        <span className="text-2xl font-bold text-principal">
          ${summary.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

