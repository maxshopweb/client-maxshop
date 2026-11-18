"use client";

import { formatCurrencyARS } from "@/app/utils/currency";
import type { PrecioMediosResult } from "@/app/utils/precio-medios.utils";

interface PrecioMediosBlockProps {
  medios: PrecioMediosResult;
  /** En ficha de producto mostrar también el % de descuento. */
  showPctLabel?: boolean;
  compact?: boolean;
}

export default function PrecioMediosBlock({
  medios,
  showPctLabel = false,
  compact = false,
}: PrecioMediosBlockProps) {
  if (!medios.muestraTransferencia && !medios.muestraCuotas) {
    return null;
  }

  return (
    <div className={compact ? "space-y-0.5 mt-1" : "space-y-1 mt-2"}>
      {medios.muestraTransferencia && medios.precioTransferencia != null && (
        <p className={compact ? "text-sm leading-snug" : "text-base sm:text-lg leading-snug"}>
          <span className="font-bold text-principal">
            {formatCurrencyARS(medios.precioTransferencia)}
          </span>{" "}
          <span className="text-terciario/80 font-normal text-xs sm:text-sm">
            con Transferencia
          </span>
        </p>
      )}
      {medios.muestraCuotas &&
        medios.cantidadCuotas != null &&
        medios.valorCuota != null && (
          <p
            className={`text-principal ${
              compact ? "text-xs" : "text-sm sm:text-base"
            }`}
          >
            {medios.cantidadCuotas} cuotas sin interés de{" "}
            {formatCurrencyARS(medios.valorCuota)}
          </p>
        )}
      {showPctLabel &&
        medios.muestraTransferencia &&
        medios.descuentoTransferenciaPct != null && (
          <p className="text-xs sm:text-sm text-terciario/80">
            <span className="text-principal font-semibold">
              {medios.descuentoTransferenciaPct}% de descuento
            </span>{" "}
            pagando con Transferencia
          </p>
        )}
    </div>
  );
}
