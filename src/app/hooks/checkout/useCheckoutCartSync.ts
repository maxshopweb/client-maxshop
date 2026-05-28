"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/app/stores/cartStore";
import { useCheckoutStore } from "./useCheckoutStore";
import {
  getCartFingerprint,
  mapCartItemsToCheckout,
} from "@/app/utils/mapCartItemsToCheckout";

/**
 * Sincroniza cartStore → checkoutStore.cartItems e invalida progreso
 * cuando el carrito cambia durante el checkout (cantidad, items, vaciar).
 */
export function useCheckoutCartSync() {
  const items = useCartStore((s) => s.items);
  const {
    setCartItems,
    resetCheckout,
    invalidateCheckoutProgress,
    setCurrentStep,
    currentStep,
  } = useCheckoutStore();

  const prevFingerprintRef = useRef<string | null>(null);
  const isInitialSyncRef = useRef(true);

  useEffect(() => {
    const fingerprint = getCartFingerprint(items);
    const mapped = mapCartItemsToCheckout(items);
    setCartItems(mapped);

    if (items.length === 0) {
      resetCheckout();
      prevFingerprintRef.current = null;
      isInitialSyncRef.current = true;
      return;
    }

    if (isInitialSyncRef.current) {
      isInitialSyncRef.current = false;
      prevFingerprintRef.current = fingerprint;
      return;
    }

    if (
      prevFingerprintRef.current !== null &&
      prevFingerprintRef.current !== fingerprint
    ) {
      invalidateCheckoutProgress();

      if (currentStep > 1) {
        setCurrentStep(1);
        toast.info("Carrito actualizado", {
          description: "Revisá los productos y continuá con la compra.",
        });
      }
    }

    prevFingerprintRef.current = fingerprint;
  }, [
    items,
    setCartItems,
    resetCheckout,
    invalidateCheckoutProgress,
    setCurrentStep,
    currentStep,
  ]);
}
