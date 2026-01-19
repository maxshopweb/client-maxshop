"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import EmailValidationService from "@/app/services/emailValidation.service";
import { PersonalFormData } from "../../schemas/personalForm.schema";
import { useCheckoutStore } from "./useCheckoutStore";

interface UseGuestCheckoutPersonalOptions {
  onSuccess: (data: PersonalFormData) => void;
}

/**
 * Hook para gestionar el checkout como invitado
 * Versión adaptada para PersonalFormData
 */
export function useGuestCheckoutPersonal({ onSuccess }: UseGuestCheckoutPersonalOptions) {
  const router = useRouter();
  const { signInAsGuest } = useAuth();
  const currentStep = useCheckoutStore((state) => state.currentStep);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isProcessingGuest, setIsProcessingGuest] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState<string | null>(null);

  const handleContinueAsGuest = useCallback(() => {
    setIsGuestMode(true);
    setEmailExistsError(null);
  }, []);

  const handleGuestFormSubmit = useCallback(
    async (data: PersonalFormData) => {
      setIsProcessingGuest(true);
      setEmailExistsError(null);

      try {
        // Validar email antes de continuar
        const emailCheck = await EmailValidationService.checkEmailExists(data.email);

        if (emailCheck.exists && !emailCheck.canLoginAsGuest) {
          const errorMessage = "Este email ya está registrado. ¿Deseas iniciar sesión?";
          setEmailExistsError(errorMessage);
          setIsProcessingGuest(false);
          toast.error(errorMessage, {
            duration: 5000,
            position: "top-center",
          });
          return;
        }

        // Iniciar sesión como invitado
        const result = await signInAsGuest({
          email: data.email,
          nombre: data.firstName,
          apellido: data.lastName,
          telefono: data.phone,
        });

        if (!result.success) {
          const errorMessage = result.message ?? "Error al continuar como invitado";
          setEmailExistsError(errorMessage);
          setIsProcessingGuest(false);
          toast.error(errorMessage);
          return;
        }

        // Si todo está bien, ejecutar callback de éxito
        onSuccess(data);
        toast.success("Sesión iniciada como invitado");
      } catch (error) {
        let errorMessage = "Error al continuar como invitado";

        if (error instanceof Error) {
          errorMessage = error.message;

          // Simplificar mensajes de error técnicos
          if (
            errorMessage.includes("prisma") ||
            errorMessage.includes("column") ||
            errorMessage.includes("database")
          ) {
            errorMessage = "Error al verificar el email. Por favor, intenta nuevamente o inicia sesión.";
          }
        }

        setEmailExistsError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsProcessingGuest(false);
      }
    },
    [signInAsGuest, onSuccess]
  );

  const handleLogin = useCallback(() => {
    // Incluir el step actual en la redirección para mantener el contexto del checkout
    const redirectUrl = `/checkout?step=${currentStep}`;
    router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
  }, [router, currentStep]);

  return {
    isGuestMode,
    isProcessingGuest,
    emailExistsError,
    handleContinueAsGuest,
    handleGuestFormSubmit,
    handleLogin,
  };
}


