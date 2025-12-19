"use client";

import { Suspense } from "react";
import { useCheckoutResult } from "../hooks/useCheckoutResult";
import CheckoutResultContainer from "../components/resultado/CheckoutResultContainer";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function CheckoutResultContent() {
  const result = useCheckoutResult();

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mismo estilo que checkout */}
      <div
        className="w-full py-6"
        style={{ backgroundColor: "var(--secundario)" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl font-bold text-white">Resultado del Pedido</h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div
            className="rounded-xl p-6 md:p-8"
            style={{
              backgroundColor: "var(--white)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <CheckoutResultContainer result={result} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Componente principal con Suspense boundary
export default function CheckoutResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-principal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground/60">Cargando...</p>
        </div>
      </div>
    }>
      <CheckoutResultContent />
    </Suspense>
  );
}

