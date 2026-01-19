"use client";

import { Button } from "./Button";
import { User } from "lucide-react";

interface GuestCheckoutButtonProps {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function GuestCheckoutButton({
  onClick,
  loading = false,
  disabled = false,
  className = ""
}: GuestCheckoutButtonProps) {
  return (
    <Button
      variant="outline-primary"
      size="lg"
      onClick={onClick}
      disabled={disabled || loading}
      className={`rounded-lg w-full ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-principal border-t-transparent rounded-full animate-spin" />
          <span>Procesando...</span>
        </>
      ) : (
        <>
          <User className="w-4 h-4" />
          <span>Continuar como invitado</span>
        </>
      )}
    </Button>
  );
}


