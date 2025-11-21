"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { useCartStore } from "@/app/stores/cartStore";
import StepIndicator from "@/app/components/cart/StepIndicator";
import Step1CartConfirmation from "@/app/components/cart/steps/Step1CartConfirmation";
import Step2ShippingData, { Step2ShippingDataRef } from "@/app/components/cart/steps/Step2ShippingData";
import Step3Payment from "@/app/components/cart/steps/Step3Payment";
import { Button } from "@/app/components/ui/Button";
import { ArrowLeft, ArrowRight, Home } from "lucide-react";

const steps = [
  { number: 1, label: "Carrito" },
  { number: 2, label: "Envío" },
  { number: 3, label: "Pago" },
];

export default function CarritoPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { items, checkoutState, setStep, calculateSummary } = useCartStore();
  const step2Ref = useRef<Step2ShippingDataRef>(null);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent('/tienda/carrito')}`);
    }
  }, [isAuthenticated, authLoading, router]);

  // Actualizar resumen cuando cambian los items
  useEffect(() => {
    calculateSummary();
  }, [items, calculateSummary]);

  // Si no hay items, redirigir a productos
  useEffect(() => {
    if (items.length === 0 && !authLoading) {
      router.push("/tienda/productos");
    }
  }, [items.length, authLoading, router]);

  const currentStep = checkoutState.step;

  const handleNext = async () => {
    if (currentStep < 3) {
      // Validar step actual antes de avanzar
      if (currentStep === 1) {
        if (items.length === 0) {
          alert("El carrito está vacío");
          return;
        }
      } else if (currentStep === 2) {
        // Validar con zod usando la referencia
        if (step2Ref.current) {
          const isValid = await step2Ref.current.validate();
          if (!isValid) {
            return; // No avanzar si hay errores
          }
        }
      }
      setStep((currentStep + 1) as 1 | 2 | 3);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  const handleFinalizar = () => {
    // Aquí se implementará la lógica de finalización del pedido
    if (!checkoutState.datosPago) {
      alert("Por favor completa los datos de pago");
      return;
    }
    
    // TODO: Implementar llamada a API para crear el pedido
    alert("Pedido finalizado! (Funcionalidad en desarrollo)");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg text-foreground/60">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // El useEffect redirigirá
  }

  if (items.length === 0) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: 'var(--sidebar-bg)' }}>
      {/* Header minimalista */}
      <div className="bg-card border-b border-input/30">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </button>
            <h1 className="text-xl font-semibold text-foreground">Finalizar Compra</h1>
            <div className="w-24" /> {/* Spacer para centrar */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Step Indicator - Más destacado y arriba */}
        <div className="mb-12">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && <Step1CartConfirmation />}
          {currentStep === 2 && <Step2ShippingData ref={step2Ref} />}
          {currentStep === 3 && <Step3Payment />}
        </div>

        {/* Navigation Buttons - Estilo minimalista */}
        <div className="flex items-center justify-between gap-4 pt-8">
          <Button
            variant="outline-primary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep < 3 ? (
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleFinalizar}
              className="flex items-center gap-2"
            >
              Finalizar Pedido
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

