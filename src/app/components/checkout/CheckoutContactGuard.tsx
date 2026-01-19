"use client";

import { motion } from "framer-motion";
import { LogIn } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import { GuestCheckoutButton } from "@/app/components/ui/GuestCheckoutButton";

interface CheckoutContactGuardProps {
  authLoading: boolean;
  isAuthenticated: boolean;
  isGuestMode: boolean;
  isProcessingGuest: boolean;
  onLogin: () => void;
  onContinueAsGuest: () => void;
  children: React.ReactNode;
}

export function CheckoutContactGuard({
  authLoading,
  isAuthenticated,
  isGuestMode,
  isProcessingGuest,
  onLogin,
  onContinueAsGuest,
  children,
}: CheckoutContactGuardProps) {
  // Mostrar loading mientras verifica auth (solo si NO estamos procesando guest checkout)
  // Esto evita mostrar el loader intermedio cuando el usuario está completando el formulario como invitado
  if (authLoading && !isProcessingGuest) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-principal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground/60">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar opciones
  if (!isAuthenticated && !isGuestMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-6"
      >
        <div className="space-y-4">
          <LogIn className="w-16 h-16 mx-auto text-foreground/30" />
          <h3 className="text-xl font-bold text-foreground">
            Inicia sesión para continuar
          </h3>
          <p className="text-foreground/60">
            Puedes iniciar sesión o continuar como invitado para completar tu pedido
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <Button variant="primary" size="lg" onClick={onLogin} className="rounded-lg w-full">
            Iniciar sesión
          </Button>
          <GuestCheckoutButton
            onClick={onContinueAsGuest}
            loading={isProcessingGuest}
          />
        </div>
      </motion.div>
    );
  }

  return <>{children}</>;
}

