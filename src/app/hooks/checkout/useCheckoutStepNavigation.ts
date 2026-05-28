"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/app/stores/cartStore";
import { useCheckoutStore } from "./useCheckoutStore";

type CheckoutStep = 1 | 2 | 3 | 4;

/**
 * Navegación entre steps con validaciones mínimas.
 */
export function useCheckoutStepNavigation() {
  const items = useCartStore((s) => s.items);
  const {
    completedSteps,
    personalData,
    shippingData,
    setCurrentStep,
  } = useCheckoutStore();

  const handleStepClick = useCallback(
    (step: CheckoutStep) => {
      if (items.length === 0 && step > 1) {
        return;
      }

      if (step >= 2 && !completedSteps.includes(1)) {
        toast.error("Completá la confirmación del carrito primero");
        return;
      }

      if (step >= 3 && !personalData) {
        toast.error("Completá tus datos personales primero");
        setCurrentStep(2);
        return;
      }

      if (step >= 4 && !shippingData) {
        toast.error("Completá los datos de envío primero");
        setCurrentStep(3);
        return;
      }

      setCurrentStep(step);
    },
    [items.length, completedSteps, personalData, shippingData, setCurrentStep]
  );

  return { handleStepClick };
}
