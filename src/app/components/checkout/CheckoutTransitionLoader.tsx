"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";

export function CheckoutTransitionLoader() {
  const pathname = usePathname();
  const { isCreatingOrder } = useCheckoutStore();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Mostrar loader si está creando el pedido
    if (isCreatingOrder) {
      setShouldShow(true);
      return;
    }

    // Si estamos en la página de resultado y acabamos de llegar
    // mantener el loader visible brevemente para transición suave
    if (pathname === '/checkout/resultado' && shouldShow) {
      // Mantener visible por un momento para que la página se cargue completamente
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 500);
      return () => clearTimeout(timer);
    }

    // Si no está creando, ocultar después de un breve delay
    if (!isCreatingOrder && shouldShow) {
      const timer = setTimeout(() => {
        setShouldShow(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isCreatingOrder, pathname, shouldShow]);

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
                {pathname === '/checkout/resultado' ? 'Cargando resultado...' : 'Procesando tu pedido...'}
              </p>
              <p
                className="text-sm"
                style={{ color: "var(--foreground)" }}
              >
                Por favor espera un momento
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

