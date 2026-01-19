"use client";

import MercadoPagoLogo from "@/app/components/icons/MercadoPagoLogo";

interface MercadoPagoButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function MercadoPagoButton({ onClick, disabled }: MercadoPagoButtonProps) {
  return (
    <div className="mb-6">
      <button
        onClick={onClick}
        disabled={disabled}
        className="w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "var(--white)",
          borderColor: "var(--principal)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center justify-center gap-3">
          <MercadoPagoLogo className="w-8 h-8 text-principal" />
          <span className="text-lg font-semibold text-principal">
            Pagar con Mercado Pago
          </span>
        </div>
      </button>
      <p className="text-xs text-foreground/60 mt-2 text-center">
        Pagá con tarjeta, dinero en cuenta o en efectivo
      </p>
    </div>
  );
}

