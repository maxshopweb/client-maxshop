"use client";

import { useEffect, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/app/stores/cartStore";
import { useCheckoutStore } from "../hooks/checkout/useCheckoutStore";
import CheckoutLayout from "@/app/components/checkout/CheckoutLayout";

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useCartStore();
  const {
    loadCartFromLocalStorage,
    setCartItems,
    setCurrentStep,
    currentStep,
  } = useCheckoutStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Marcar como montado solo en el cliente para evitar hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    if (!isMounted) return;
    
    loadCartFromLocalStorage();
    
    // Si hay parámetro step en la URL, establecerlo (solo en carga inicial)
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
  }, [isMounted, loadCartFromLocalStorage, searchParams, setCurrentStep, isInitialLoad]);

  // Sincronizar URL cuando cambia currentStep (después de carga inicial)
  useEffect(() => {
    if (!isMounted || isInitialLoad) return;
    
    const currentStepParam = searchParams.get('step');
    const stepFromUrl = currentStepParam ? parseInt(currentStepParam) : 1;
    
    // Solo actualizar URL si el step en el store es diferente al de la URL
    if (currentStep !== stepFromUrl) {
      router.replace(`/checkout?step=${currentStep}`, { scroll: false });
    }
  }, [currentStep, isMounted, isInitialLoad, router, searchParams]);

  // Sincronizar items del carrito con el checkout store
  useEffect(() => {
    if (items.length > 0) {
      const formattedItems = items.map((item) => ({
        id: item.id_prod,
        nombre: item.producto?.nombre || "Producto sin nombre",
        precio: item.precio_unitario || 0,
        cantidad: item.cantidad || 1,
        img_principal: item.producto?.img_principal || "",
        subtotal: item.subtotal || 0,
      }));
      setCartItems(formattedItems);
    }
  }, [items, setCartItems]);

  // No redirigir nunca automáticamente a /: el usuario debe usar "Volver" si quiere salir.
  // Mostrar siempre el layout cuando estamos en /checkout (carrito vacío = mensaje en Step 1).
  if (!isMounted) return null;

  return <CheckoutLayout />;
}

// Componente principal con Suspense boundary
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

