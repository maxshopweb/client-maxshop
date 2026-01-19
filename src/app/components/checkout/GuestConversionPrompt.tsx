"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { CheckCircle, X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";

interface GuestConversionPromptProps {
  email: string;
  onConvert?: () => void;
  onSkip?: () => void;
}

export function GuestConversionPrompt({
  email,
  onConvert,
  onSkip
}: GuestConversionPromptProps) {
  const { convertGuestToUser } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!password || password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConvert = async () => {
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await convertGuestToUser(password, email);
      
      if (result.success) {
        toast.success("Cuenta creada exitosamente");
        onConvert?.();
      } else {
        toast.error(result.message ?? "Error al crear la cuenta");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la cuenta";
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6 space-y-6 border-2 border-principal/20"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-principal/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-principal" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              ¡Compra realizada con éxito!
            </h3>
            <p className="text-sm text-foreground/60 mt-1">
              Recibirás la confirmación en {email}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-2">
            ¿Deseas crear una cuenta?
          </h4>
          <p className="text-sm text-foreground/60 mb-4">
            Crea una cuenta para hacer seguimiento más fácil de tus pedidos y acceder a tu historial de compras.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            error={errors.password}
            placeholder="Mínimo 6 caracteres"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.password
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            error={errors.confirmPassword}
            placeholder="Repite la contraseña"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.confirmPassword
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConvert}
            disabled={isProcessing || !password || !confirmPassword}
            className="rounded-lg w-full"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creando cuenta...</span>
              </>
            ) : (
              "Crear cuenta"
            )}
          </Button>

          <Button
            variant="outline-primary"
            size="lg"
            onClick={handleSkip}
            disabled={isProcessing}
            className="rounded-lg w-full"
          >
            Continuar como invitado
          </Button>
        </div>
      </div>
    </motion.div>
  );
}


