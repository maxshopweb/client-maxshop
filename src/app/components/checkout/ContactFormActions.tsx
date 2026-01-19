"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

interface ContactFormActionsProps {
  onBack: () => void;
  isValid: boolean;
  isProcessingGuest: boolean;
}

export function ContactFormActions({
  onBack,
  isValid,
  isProcessingGuest,
}: ContactFormActionsProps) {
  return (
    <div className="pt-4 flex gap-4">
      <Button
        type="button"
        variant="outline-primary"
        size="lg"
        onClick={onBack}
        className="rounded-lg flex-1"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={!isValid || isProcessingGuest}
        className="rounded-lg flex-1"
      >
        {isProcessingGuest ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Procesando...</span>
          </>
        ) : (
          'Continuar'
        )}
      </Button>
    </div>
  );
}

