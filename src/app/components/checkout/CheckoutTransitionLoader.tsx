"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

function getLoaderMessage(pathname: string, isRedirectingToPayment: boolean): string {
  if (isRedirectingToPayment) {
    return "Redirigiendo a Mercado Pago...";
  }
  if (pathname === "/checkout/resultado") {
    return "Cargando resultado...";
  }
  return "Procesando tu pedido...";
}

function getLoaderSubmessage(isRedirectingToPayment: boolean): string {
  if (isRedirectingToPayment) {
    return "No cierres esta ventana";
  }
  return "Por favor espera un momento";
}

export function CheckoutTransitionLoader() {
  const pathname = usePathname();
  const { isCreatingOrder, isRedirectingToPayment } = useCheckoutStore();
  const [shouldShow, setShouldShow] = useState(false);

  const isBlocking = isCreatingOrder || isRedirectingToPayment;

  useEffect(() => {
    if (isBlocking) {
      setShouldShow(true);
      return;
    }

    if (pathname === "/checkout/resultado" && shouldShow) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    if (!isBlocking && shouldShow) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isBlocking, isCreatingOrder, isRedirectingToPayment, pathname, shouldShow]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            backgroundColor: "var(--background)",
          }}
        >
          <div className="text-center space-y-4">
            <div className="relative">
              <div
                className="w-16 h-16 border-4 rounded-full animate-spin mx-auto"
                style={{
                  borderColor: "var(--secundario)",
                  borderTopColor: "transparent",
                }}
              />
            </div>
            <div className="space-y-2">
              <p
                className="text-lg font-semibold"
                style={{ color: "var(--foreground)" }}
              >
                {getLoaderMessage(pathname, isRedirectingToPayment)}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--foreground)" }}
              >
                {getLoaderSubmessage(isRedirectingToPayment)}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
