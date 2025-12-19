"use client";

import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { IBankDetails } from "../../types/checkout-result.type";
import { Button } from "@/app/components/ui/Button";

interface BankDetailsProps {
  datos: IBankDetails;
  id_venta?: string | number;
}

export default function BankDetails({ datos, id_venta }: BankDetailsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const CopyButton = ({ text, field, label }: { text: string; field: string; label: string }) => (
    <button
      onClick={() => copyToClipboard(text, field)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-principal/10 transition-colors"
      style={{ color: "var(--principal)" }}
    >
      {copied === field ? (
        <>
          <Check className="w-4 h-4" />
          <span className="text-sm">Copiado</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" />
          <span className="text-sm">{label}</span>
        </>
      )}
    </button>
  );

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
          Datos para Transferencia Bancaria
        </h3>

        <div className="space-y-4">
          {/* Banco */}
          <DetailRow
            label="Banco"
            value={datos.banco}
            onCopy={() => copyToClipboard(datos.banco, "banco")}
            copied={copied === "banco"}
          />

          {/* Tipo de cuenta */}
          <DetailRow
            label="Tipo de Cuenta"
            value={datos.tipo_cuenta}
            onCopy={() => copyToClipboard(datos.tipo_cuenta, "tipo")}
            copied={copied === "tipo"}
          />

          {/* Número de cuenta */}
          <DetailRow
            label="Número de Cuenta"
            value={datos.numero_cuenta}
            onCopy={() => copyToClipboard(datos.numero_cuenta, "cuenta")}
            copied={copied === "cuenta"}
          />

          {/* CBU */}
          {datos.cbu && (
            <DetailRow
              label="CBU"
              value={datos.cbu}
              onCopy={() => copyToClipboard(datos.cbu!, "cbu")}
              copied={copied === "cbu"}
            />
          )}

          {/* Alias */}
          {datos.alias && (
            <DetailRow
              label="Alias"
              value={datos.alias}
              onCopy={() => copyToClipboard(datos.alias!, "alias")}
              copied={copied === "alias"}
            />
          )}

          {/* Titular */}
          <DetailRow
            label="Titular"
            value={datos.titular}
            onCopy={() => copyToClipboard(datos.titular, "titular")}
            copied={copied === "titular"}
          />

          {/* CUIT */}
          {datos.cuit && (
            <DetailRow
              label="CUIT"
              value={datos.cuit}
              onCopy={() => copyToClipboard(datos.cuit!, "cuit")}
              copied={copied === "cuit"}
            />
          )}
        </div>

        {/* Instrucciones */}
        {datos.instrucciones && (
          <div className="mt-6 pt-6 border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}>
            <p className="text-sm text-foreground/70 leading-relaxed">
              <strong className="text-foreground">Importante:</strong> {datos.instrucciones}
              {id_venta && (
                <span className="block mt-2 font-mono text-principal font-semibold">
                  Incluye el número de pedido: #{id_venta}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}

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

