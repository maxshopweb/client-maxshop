"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutResult } from "@/app/hooks/checkout/useCheckoutResult";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useAuth } from "@/app/context/AuthContext";
import CheckoutResultContainer from "../../components/checkout/CheckoutResultContainer";
import { motion } from "framer-motion";

export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function CheckoutResultContent() {
  const router = useRouter();
  const result = useCheckoutResult();
  const { clearCart } = useCartStore();
  const { resetCheckout, setWasGuest } = useCheckoutStore();
  const { logout } = useAuth();

  // Validar acceso: solo redirigir a /checkout cuando no hay resultado válido
  // No redirigir si la URL tiene id_venta (evita race: searchParams pueden tardar en estar listos)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlHasIdVenta = window.location.search.includes('id_venta=');
    if (urlHasIdVenta) return;
    if (!result.id_venta && result.status !== 'processing') {
      router.push('/checkout');
    }
  }, [result.id_venta, result.status, router]);

  // Limpiar carrito y checkout al montar con resultado válido (efectivo/transferencia
  // redirigen con window.location.href y la limpieza no se hace en useCreateOrderFromCheckout)
  useEffect(() => {
    if (!result.id_venta) return;
    const wasGuest = useCheckoutStore.getState().wasGuest;
    clearCart();
    resetCheckout();
    if (wasGuest) {
      setWasGuest(true); // Mantener para que la UI no muestre "Ver mis pedidos" a invitados
      logout(true);
    }
  }, [result.id_venta, clearCart, resetCheckout, setWasGuest, logout]);

  // Si no hay datos válidos: no redirigir si la URL tiene id_venta (efecto arriba); mostrar loading hasta que params carguen
  if (!result.id_venta && result.status !== 'processing') {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-principal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground/60">Cargando resultado...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mismo estilo que checkout */}
      <div
        className="w-full py-6"
        style={{ backgroundColor: "var(--secundario)" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl font-bold text-white">Resultado del pedido</h1>
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

