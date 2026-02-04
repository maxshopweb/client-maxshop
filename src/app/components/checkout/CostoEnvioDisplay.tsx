"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CostoEnvioDisplayProps {
  costoEnvio: number | null;
  isLoading?: boolean;
}

export default function CostoEnvioDisplay({ 
  costoEnvio, 
  isLoading = false 
}: CostoEnvioDisplayProps) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-foreground/5 border border-foreground/10"
      >
        <p className="text-sm text-foreground/70">
          Calculando costo de envío...
        </p>
      </motion.div>
    );
  }

  if (costoEnvio === null || costoEnvio === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="p-4 rounded-lg bg-principal/10 border border-principal/20"
      >
        <p className="text-sm text-foreground/70 mb-1">
          Costo de envío calculado:
        </p>
        <p className="text-2xl font-bold text-principal">
          ${costoEnvio.toFixed(2)}
        </p>
      </motion.div>
    </AnimatePresence>
  );
}


