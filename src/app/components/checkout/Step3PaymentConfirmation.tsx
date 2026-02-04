"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import { LogIn, ArrowLeft } from "lucide-react";
import { MetodoPagoMercadoPago } from "@/app/components/modals/Venta/MetodoPagoMercadoPago";
import { MetodoPagoEfectivo } from "@/app/components/modals/Venta/MetodoPagoEfectivo";
import { MetodoPagoTransferencia } from "@/app/components/modals/Venta/MetodoPagoTransferencia";
import { useStep4PaymentConfirmation } from "@/app/hooks/checkout/useStep4PaymentConfirmation";

export default function Step3PaymentConfirmation() {
  const {
    guard,
    selectedMethod,
    handleSelectMethod,
    handleGoBack,
    handleLoginRedirect,
    handleConfirmOrder,
    isCalculandoEnvio,
    isCreating,
  } = useStep4PaymentConfirmation();

  if (!guard.isValid) {
    if (guard.reason === "no-auth") {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 space-y-6"
        >
          <div className="space-y-4">
            <LogIn className="w-16 h-16 mx-auto text-foreground/30" />
            <h3 className="text-xl font-bold text-foreground/90">Inicia sesión para continuar</h3>
            <p className="text-foreground/60">Necesitas estar autenticado para confirmar tu pedido</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleLoginRedirect}
            className="rounded-lg"
          >
            Iniciar Sesión
          </Button>
        </motion.div>
      );
    }
    return null;
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground/90 mb-6">Método de pago</h2>

      <MetodoPagoMercadoPago
        isSelected={selectedMethod === "mercadopago"}
        onClick={() => handleSelectMethod("mercadopago")}
      />

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }} />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-foreground/60">O</span>
        </div>
      </div>

      <div className="flex gap-4">
        <MetodoPagoEfectivo
          isSelected={selectedMethod === "efectivo"}
          onClick={() => handleSelectMethod("efectivo")}
        />
        <MetodoPagoTransferencia
          isSelected={selectedMethod === "transferencia"}
          onClick={() => handleSelectMethod("transferencia")}
        />
      </div>

      <div className="pt-4 flex gap-4">
        <Button variant="outline-primary" size="lg" onClick={handleGoBack} className="rounded-lg flex-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmOrder}
          disabled={!selectedMethod || isCreating || isCalculandoEnvio}
          className="rounded-lg flex-1"
        >
          {isCreating ? "Procesando..." : isCalculandoEnvio ? "Calculando envío..." : "Confirmar pedido"}
        </Button>
      </div>
    </motion.div>
  );
}
