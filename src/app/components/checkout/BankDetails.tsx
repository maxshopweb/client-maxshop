"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { IBankDetails } from "../../types/checkout-result.type";
import { useClipboard } from "../../hooks/checkout/useClipboard";
import { ComprobanteNotice } from "../contact/ContactLinks";

/** Devuelve el código de operación a mostrar: cod_interno o "MAX-" + id_venta a 8 dígitos */
function getNumeroPedidoDisplay(cod_interno?: string | null, id_venta?: string | number): string | null {
  if (cod_interno) return cod_interno;
  if (id_venta != null && id_venta !== "") {
    const n = Number(id_venta);
    if (!Number.isNaN(n)) return "MAX-" + String(n).padStart(8, "0");
  }
  return null;
}

interface BankDetailsProps {
  datos: IBankDetails;
  id_venta?: string | number;
  cod_interno?: string | null;
}

const TITULO_DATOS_BANCARIOS = "Datos para transferencia bancaria";

/**
 * Componente presentacional para mostrar datos bancarios
 * La lógica de copiado está en el hook useClipboard
 */
export default function BankDetails({ datos, id_venta, cod_interno }: BankDetailsProps) {
  const { copy, copied } = useClipboard();
  const numeroPedido = getNumeroPedidoDisplay(cod_interno, id_venta);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="space-y-4"
    >
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "rgba(var(--principal-rgb), 0.05)",
          border: "2px solid rgba(var(--principal-rgb), 0.2)",
        }}
      >
        <h3 className="text-xl font-bold text-foreground mb-6 text-center">
          {TITULO_DATOS_BANCARIOS}
        </h3>

        <div className="space-y-4">
          {/* Titular */}
          <DetailRow
            label="Titular"
            value={datos.titular}
            onCopy={() => copy(datos.titular, "titular")}
            copied={copied === "titular"}
          />

          {/* CUIT/CUIL */}
          {datos.cuit && (
            <DetailRow
              label="CUIT/CUIL"
              value={datos.cuit}
              onCopy={() => copy(datos.cuit, "cuit")}
              copied={copied === "cuit"}
            />
          )}

          {/* CVU (almacenado en cbu por compatibilidad) */}
          {datos.cbu && (
            <DetailRow
              label="CVU"
              value={datos.cbu}
              onCopy={() => copy(datos.cbu, "cvu")}
              copied={copied === "cvu"}
            />
          )}

          {/* Alias */}
          {datos.alias && (
            <DetailRow
              label="Alias"
              value={datos.alias}
              onCopy={() => copy(datos.alias, "alias")}
              copied={copied === "alias"}
            />
          )}
        </div>

        {/* Instrucciones */}
        {datos.instrucciones && (
          <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}>
            <p className="text-sm text-foreground/70 leading-relaxed">
              <strong className="text-foreground">Importante:</strong> {datos.instrucciones}
              {numeroPedido && (
                <span className="block mt-2 font-mono text-principal font-semibold">
                  Incluye el número de pedido: {numeroPedido}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <ComprobanteNotice orderId={numeroPedido} />
    </motion.div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}

/**
 * Componente presentacional para una fila de detalle bancario
 */
function DetailRow({ label, value, onCopy, copied }: DetailRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex-1">
        <p className="text-sm text-foreground/60 mb-1">{label}</p>
        <p className="text-base font-semibold text-foreground font-mono">{value}</p>
      </div>
      <button
        onClick={onCopy}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-principal/10 transition-colors self-start sm:self-auto"
        style={{ color: "var(--principal)" }}
        aria-label={`Copiar ${label}`}
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            <span className="text-sm">Copiado</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            <span className="text-sm">Copiar</span>
          </>
        )}
      </button>
    </div>
  );
}

