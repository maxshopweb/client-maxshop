"use client";

import ResultMessage from "../ResultMessage";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useCheckoutResultConfig } from "@/app/hooks/checkout/useCheckoutResultConfig"; 

interface ProcessingStateProps {
  id_venta?: string | number;
}

export default function ProcessingState({ id_venta }: ProcessingStateProps) {
  const config = useCheckoutResultConfig('processing');

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        {/* Icono con animación de rotación */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center bg-principal/10"
            style={{
              border: "3px solid rgba(var(--principal-rgb), 0.3)",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Loader2 className="w-12 h-12 text-principal" />
            </motion.div>
          </div>
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-4"
        >
          {config.titulo}
        </motion.h1>
      </motion.div>
      <ResultMessage mensaje={config.mensaje} id_venta={id_venta} />
    </>
  );
}

