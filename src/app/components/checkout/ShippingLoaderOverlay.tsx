"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ShippingLoaderOverlayProps {
  isVisible: boolean;
  message?: string;
}

export default function ShippingLoaderOverlay({ 
  isVisible, 
  message = "Calculando costo de envío..." 
}: ShippingLoaderOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center w-full text-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-center gap-4 p-8 rounded-xl"
            style={{
              backgroundColor: 'var(--white)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            }}
          >
            <Loader2 
              className="w-12 h-12 animate-spin" 
              style={{ color: 'var(--principal)' }}
            />
            <p className="text-lg font-medium text-foreground">{message}</p>
            <p className="text-sm text-foreground/60">Por favor espera...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


