"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/** Devuelve el código de operación a mostrar: cod_interno o "MAX-" + id_venta a 8 dígitos */
function getNumeroPedidoDisplay(cod_interno?: string | null, id_venta?: string | number): string | null {
  if (cod_interno) return cod_interno;
  if (id_venta != null && id_venta !== "") {
    const n = Number(id_venta);
    if (!Number.isNaN(n)) return "MAX-" + String(n).padStart(8, "0");
  }
  return null;
}

interface ResultMessageProps {
  mensaje: string;
  children?: ReactNode;
  id_venta?: string | number;
  cod_interno?: string | null;
}

export default function ResultMessage({ mensaje, children, id_venta, cod_interno }: ResultMessageProps) {
  const numeroPedido = getNumeroPedidoDisplay(cod_interno, id_venta);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="space-y-4"
    >
      {/* Mensaje principal */}
      <div
        className="p-6 rounded-xl"
        style={{
          backgroundColor: "var(--white)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <p className="text-lg text-foreground/80 leading-relaxed text-center">
          {mensaje}
        </p>

        {/* Número de pedido (cod_interno tipo MAX-00000001) */}
        {numeroPedido && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}>
            <p className="text-sm text-foreground/60 text-center">
              <span className="font-semibold">Número de pedido:</span>{" "}
              <span className="font-mono text-principal">{numeroPedido}</span>
            </p>
          </div>
        )}
      </div>

      {/* Contenido adicional */}
      {children && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

