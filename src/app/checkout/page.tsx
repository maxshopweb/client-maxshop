"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/app/stores/cartStore";
import { useCheckoutStore } from "./hooks/useCheckoutStore";
import CheckoutLayout from "./components/CheckoutLayout";

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items } = useCartStore();
  const { loadCartFromLocalStorage, setCartItems, cartItems, setCurrentStep } = useCheckoutStore();

  // Cargar carrito desde localStorage al montar
  useEffect(() => {
    loadCartFromLocalStorage();
    
    // Si hay parámetro step en la URL, establecerlo
    const stepParam = searchParams.get('step');
    if (stepParam) {
      const step = parseInt(stepParam);
      if (step >= 1 && step <= 3) {
        setCurrentStep(step as 1 | 2 | 3);
      }
    }
  }, [loadCartFromLocalStorage, searchParams, setCurrentStep]);

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

  // Redirigir si no hay items SOLO si no hay datos de checkout guardados
  // Esto evita que redirija cuando recargas la página durante el checkout
  useEffect(() => {
    const checkoutData = useCheckoutStore.getState();
    const hasCheckoutData = checkoutData.contactData || checkoutData.paymentMethod || checkoutData.completedSteps.length > 0;
    
    // Solo redirigir si no hay items Y no hay datos de checkout guardados
    if (items.length === 0 && cartItems.length === 0 && !hasCheckoutData) {
      router.push("/");
    }
  }, [items.length, cartItems.length, router]);

  // No renderizar nada mientras se verifica, pero no redirigir inmediatamente
  const checkoutData = useCheckoutStore.getState();
  const hasCheckoutData = checkoutData.contactData || checkoutData.paymentMethod || checkoutData.completedSteps.length > 0;
  
  if (items.length === 0 && cartItems.length === 0 && !hasCheckoutData) {
    return null; // El useEffect redirigirá
  }

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

