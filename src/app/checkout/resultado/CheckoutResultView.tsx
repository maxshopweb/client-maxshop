"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutResult } from "@/app/hooks/checkout/useCheckoutResult";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useCartStore } from "@/app/stores/cartStore";
import { useAuth } from "@/app/context/AuthContext";
import CheckoutResultContainer from "@/app/components/checkout/CheckoutResultContainer";
import { ResultSkeleton } from "@/app/components/checkout/ResultSkeleton";
import type { IConfigTienda } from "@/app/types/config-tienda.type";
import type { ICheckoutResult } from "@/app/types/checkout-result.type";
import { motion } from "framer-motion";

interface CheckoutResultViewProps {
  initialConfig: IConfigTienda;
}

function CheckoutResultContent({ initialConfig }: { initialConfig: IConfigTienda }) {
  const router = useRouter();
  const result = useCheckoutResult();
  const { clearCart } = useCartStore();
  const { resetCheckout, setWasGuest } = useCheckoutStore();
  const { logout } = useAuth();

  const resultWithBank = useMemo((): ICheckoutResult => {
    if (result.status === "transferencia" || result.status === "efectivo") {
      const db = initialConfig?.datos_bancarios;
      return {
        ...result,
        datos_bancarios: db
          ? {
              banco: db.banco,
              tipo_cuenta: db.tipo_cuenta,
              numero_cuenta: db.numero_cuenta,
              cbu: db.cbu ?? undefined,
              alias: db.alias ?? undefined,
              titular: db.titular,
              cuit: db.cuit ?? undefined,
              instrucciones: db.instrucciones ?? undefined,
            }
          : undefined,
      };
    }
    return result;
  }, [result, initialConfig?.datos_bancarios]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlHasIdVenta = window.location.search.includes("id_venta=");
    if (urlHasIdVenta) return;
    if (!result.id_venta && result.status !== "processing") {
      router.push("/checkout");
    }
  }, [result.id_venta, result.status, router]);

  useEffect(() => {
    if (!result.id_venta) return;
    const wasGuest = useCheckoutStore.getState().wasGuest;
    clearCart();
    resetCheckout();
    if (wasGuest) {
      setWasGuest(true);
      logout(true);
    }
  }, [result.id_venta, clearCart, resetCheckout, setWasGuest, logout]);

  if (!result.id_venta && result.status !== "processing") {
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
      <div
        className="w-full py-6"
        style={{ backgroundColor: "var(--secundario)" }}
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl font-bold text-white">Resultado del pedido</h1>
        </div>
      </div>
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
            <CheckoutResultContainer result={resultWithBank} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutResultView({ initialConfig }: CheckoutResultViewProps) {
  return (
    <Suspense fallback={<ResultSkeleton />}>
      <CheckoutResultContent initialConfig={initialConfig} />
    </Suspense>
  );
}
