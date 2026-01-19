"use client";

import { IDatosPago } from "@/app/types/cart.type";

interface PaymentGatewayNoteProps {
  metodo: string | undefined;
}

export function PaymentGatewayNote({ metodo }: PaymentGatewayNoteProps) {
  if (metodo !== 'credito' && metodo !== 'debito') {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-principal/10 rounded-lg">
      <p className="text-sm text-foreground/80">
        <strong>Nota:</strong> La integración con la pasarela de pago se implementará próximamente. 
        Por ahora, este formulario es solo una vista previa.
      </p>
    </div>
  );
}

