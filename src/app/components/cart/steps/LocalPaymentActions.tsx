"use client";

import { Button } from "@/app/components/ui/Button";
import { IDatosPago } from "@/app/types/cart.type";

interface LocalPaymentActionsProps {
  metodo: string | undefined;
  isCreating: boolean;
  onConfirm: () => void;
}

export function LocalPaymentActions({ metodo, isCreating, onConfirm }: LocalPaymentActionsProps) {
  if (metodo !== 'efectivo' && metodo !== 'transferencia') {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t">
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={onConfirm}
        disabled={isCreating || !metodo}
        className="rounded-lg"
      >
        {isCreating ? "Procesando..." : `Confirmar pedido - ${metodo === 'efectivo' ? 'Efectivo' : 'Transferencia'}`}
      </Button>
      <p className="text-xs text-foreground/60 mt-2 text-center">
        {metodo === 'transferencia' 
          ? "Recibirás los datos bancarios para realizar la transferencia"
          : "El pago se realizará al momento de la entrega"}
      </p>
    </div>
  );
}

