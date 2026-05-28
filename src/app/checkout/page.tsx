"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCheckoutStore } from "../hooks/checkout/useCheckoutStore";
import { useCheckoutCartSync } from "../hooks/checkout/useCheckoutCartSync";
import CheckoutLayout from "@/app/components/checkout/CheckoutLayout";

export const dynamic = 'force-dynamic';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCurrentStep, currentStep } = useCheckoutStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useCheckoutCartSync();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const stepParam = searchParams.get('step');
    if (stepParam && isInitialLoad) {
      const step = parseInt(stepParam);
      if (step >= 1 && step <= 4) {
        setCurrentStep(step as 1 | 2 | 3 | 4);
      }
      setIsInitialLoad(false);
    } else if (!stepParam && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [isMounted, searchParams, setCurrentStep, isInitialLoad]);

  useEffect(() => {
    if (!isMounted || isInitialLoad) return;

    const currentStepParam = searchParams.get('step');
    const stepFromUrl = currentStepParam ? parseInt(currentStepParam) : 1;

    if (currentStep !== stepFromUrl) {
      router.replace(`/checkout?step=${currentStep}`, { scroll: false });
    }
  }, [currentStep, isMounted, isInitialLoad, router, searchParams]);

  if (!isMounted) return null;

  return <CheckoutLayout />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
