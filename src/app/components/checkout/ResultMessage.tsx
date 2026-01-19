"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ResultMessageProps {
  mensaje: string;
  children?: ReactNode;
  id_venta?: string | number;
}

export default function ResultMessage({ mensaje, children, id_venta }: ResultMessageProps) {
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

        {/* ID de venta si existe */}
        {id_venta && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}>
            <p className="text-sm text-foreground/60 text-center">
              <span className="font-semibold">Número de pedido:</span>{" "}
              <span className="font-mono text-principal">#{id_venta}</span>
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

