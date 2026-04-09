"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export default function EmptyCartCheckoutState() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
      <p className="text-lg text-foreground/80 font-medium">No hay productos en el carrito</p>
      <p className="text-sm text-foreground/55 mt-2 max-w-md mx-auto">
        Agregá productos para continuar, o volvé al inicio para seguir navegando.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mt-8 max-w-md mx-auto">
        <Button
          type="button"
          variant="outline-primary"
          size="lg"
          onClick={handleBack}
          className="rounded-lg w-full sm:flex-1"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Atrás
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => router.push("/")}
          className="rounded-lg w-full sm:flex-1"
        >
          <Home className="w-4 h-4 shrink-0" />
          Ir al inicio
        </Button>
      </div>
    </motion.div>
  );
}
