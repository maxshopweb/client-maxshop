"use client";

import { ArrowLeft } from "lucide-react";
import { CreditCard, Wallet, Banknote, Smartphone, LucideIcon } from "lucide-react";

const paymentIcons: Record<string, LucideIcon> = {
  efectivo: Banknote,
  transferencia: Smartphone,
  credito: CreditCard,
  debito: CreditCard,
};

interface PaymentHeaderProps {
  metodo?: string;
  onBack: () => void;
}

export function PaymentHeader({ metodo, onBack }: PaymentHeaderProps) {
  const PaymentIcon = metodo ? paymentIcons[metodo] : Wallet;

  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-3 pb-6 border-b flex-1">
        <PaymentIcon className="w-6 h-6 text-principal" />
        <h3 className="text-xl font-semibold text-foreground/90">
          Método de pago
        </h3>
      </div>
    </div>
  );
}

