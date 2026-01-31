"use client";

import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface ShippingQuotationStatusProps {
  isCotizando: boolean;
  costoEnvio: number | null;
  errorCotizacion: string | null;
  codigoPostal: string | undefined;
}

/**
 * Component responsible for displaying shipping quotation status.
 * Shows loading, success, error, and validation states.
 */
export default function ShippingQuotationStatus({
  isCotizando,
  costoEnvio,
  errorCotizacion,
  codigoPostal,
}: ShippingQuotationStatusProps) {
  const codigoPostalInvalido = codigoPostal && !/^[0-9]{4}$/.test(codigoPostal);

  return (
    <div className="space-y-2">
      {isCotizando && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-principal/5 border border-principal/20">
          <Loader2 className="w-4 h-4 animate-spin text-principal" />
          <p className="text-sm text-foreground/70">Calculando costo de envío...</p>
        </div>
      )}

      {!isCotizando && costoEnvio !== null && costoEnvio > 0 && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <div className="flex-1">
            <p className="text-sm text-green-700 font-medium">
              Costo de envío: <span className="font-bold">${costoEnvio.toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}

      {errorCotizacion && !isCotizando && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
          <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-700">{errorCotizacion}</p>
            <p className="text-xs text-yellow-600 mt-1">
              Podés continuar con el pedido. El costo de envío se calculará al finalizar.
            </p>
          </div>
        </div>
      )}

      {codigoPostalInvalido && (
        <div className="p-2 rounded-lg bg-foreground/5 border border-foreground/10">
          <p className="text-xs text-foreground/60">
            El código postal debe tener 4 dígitos para calcular el envío
          </p>
        </div>
      )}
    </div>
  );
}
