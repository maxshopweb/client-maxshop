"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCheckoutStore } from "../hooks/useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import { Button } from "@/app/components/ui/Button";
import { CreditCard, Wallet, Banknote, Smartphone, LogIn, ArrowLeft } from "lucide-react";

const paymentMethods = [
  { value: "credito", label: "Tarjeta de Crédito", icon: CreditCard, emoji: "💳" },
  { value: "debito", label: "Tarjeta de Débito", icon: CreditCard, emoji: "💰" },
  { value: "efectivo", label: "Efectivo", icon: Banknote, emoji: "💵" },
  { value: "transferencia", label: "Transferencia Bancaria", icon: Smartphone, emoji: "🏦" },
];

export default function Step3PaymentConfirmation() {
  const router = useRouter();
  const { paymentMethod, setPaymentMethod, completeStep, resetCheckout, setCurrentStep } = useCheckoutStore();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { clearCart } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(paymentMethod);

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // No redirigir automáticamente, mostrar mensaje
    }
  }, [isAuthenticated, authLoading]);

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setPaymentMethod(method);
  };

  const handleConfirmOrder = async () => {
    if (!selectedMethod) {
      alert("Por favor selecciona un método de pago");
      return;
    }

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    // Obtener todos los datos del checkout
    const checkoutData = {
      cartItems: useCheckoutStore.getState().cartItems,
      contactData: useCheckoutStore.getState().contactData,
      paymentMethod: selectedMethod,
    };

    console.log("Pedido confirmado:", checkoutData);
    completeStep(3);
    
    // Limpiar todo
    clearCart();
    resetCheckout();
    
    // Redirigir al home
    router.push("/");
  };

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
  };

  // Mostrar loading mientras verifica auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-principal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground/60">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje y botón de login
  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-6"
      >
        <div className="space-y-4">
          <LogIn className="w-16 h-16 mx-auto text-foreground/30" />
          <h3 className="text-xl font-bold text-foreground">
            Inicia sesión para continuar
          </h3>
          <p className="text-foreground/60">
            Necesitas estar autenticado para confirmar tu pedido
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={handleLogin} className="rounded-lg">
          Iniciar Sesión
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Método de Pago</h2>

      {/* Selector de métodos de pago */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.value;

          return (
            <motion.button
              key={method.value}
              onClick={() => handleSelectMethod(method.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-6 rounded-xl text-left transition-all
                ${isSelected
                  ? "border-2"
                  : "border"
                }
              `}
              style={{
                backgroundColor: isSelected ? "rgba(var(--principal-rgb), 0.1)" : "var(--white)",
                borderColor: isSelected
                  ? "var(--principal)"
                  : "rgba(23, 28, 53, 0.1)",
                boxShadow: isSelected
                  ? "0 4px 12px rgba(var(--principal-rgb), 0.2)"
                  : "0 2px 8px rgba(0,0,0,0.08)",
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                    w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                  `}
                  style={{
                    backgroundColor: isSelected
                      ? "var(--principal)"
                      : "rgba(23, 28, 53, 0.05)",
                  }}
                >
                  {method.emoji}
                </div>
                <div>
                  <p
                    className="font-semibold text-lg"
                    style={{
                      color: isSelected ? "var(--principal)" : "var(--foreground)",
                    }}
                  >
                    {method.label}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Mensaje informativo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-xl"
        style={{
          backgroundColor: "rgba(var(--principal-rgb), 0.1)",
          border: "1px solid rgba(var(--principal-rgb), 0.2)",
        }}
      >
        <p className="text-sm text-foreground/80">
          <strong>Nota:</strong> La integración con procesadores de pago se implementará
          próximamente. Por ahora, selecciona tu método preferido.
        </p>
      </motion.div>

      {/* Botones */}
      <div className="pt-4 flex gap-4">
        <Button
          variant="outline-primary"
          size="lg"
          onClick={() => setCurrentStep(2)}
          className="rounded-lg flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleConfirmOrder}
          disabled={!selectedMethod}
          className="rounded-lg flex-1"
        >
          Confirmar Pedido
        </Button>
      </div>
    </motion.div>
  );
}

