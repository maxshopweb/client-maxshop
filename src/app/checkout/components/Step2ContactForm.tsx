"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutStore } from "../hooks/useCheckoutStore";
import { contactFormSchema, ContactFormData } from "../schemas/contactForm.schema";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { LogIn, ArrowLeft } from "lucide-react";

export default function Step2ContactForm() {
  const router = useRouter();
  const { contactData, setContactData, setCurrentStep, completeStep } = useCheckoutStore();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: contactData || {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
    },
  });

  // Autocompletar con datos del usuario si está autenticado
  useEffect(() => {
    if (isAuthenticated && user && !contactData) {
      setValue("firstName", user.nombre || "");
      setValue("lastName", user.apellido || "");
      setValue("phone", user.telefono || "");
    }
  }, [isAuthenticated, user, contactData, setValue]);

  // Verificar autenticación al montar
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // No redirigir automáticamente, mostrar mensaje
    }
  }, [isAuthenticated, authLoading]);

  const onSubmit = (data: ContactFormData) => {
    setContactData(data);
    completeStep(2);
    setCurrentStep(3);
  };

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
  };

  // Mostrar loading mientras verifica auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-principal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-foreground/60">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje y botón de login
  if (!isAuthenticated) {
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
            Necesitas estar autenticado para completar tu pedido
          </p>
        </div>
        <Button variant="primary" size="lg" onClick={handleLogin} className="rounded-lg">
          Iniciar Sesión
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-foreground mb-6">Información de Contacto</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* First Name */}
          <Input
            label="Nombre (First Name)"
            {...register("firstName")}
            error={errors.firstName?.message}
            placeholder="Nombre"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.firstName
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />

          {/* Last Name */}
          <Input
            label="Apellido (Last Name)"
            {...register("lastName")}
            error={errors.lastName?.message}
            placeholder="Apellido"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.lastName
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />
        </div>

        {/* Address */}
        <Input
          label="Dirección (Address)"
          {...register("address")}
          error={errors.address?.message}
          placeholder="Dirección completa"
          className="rounded-lg"
          style={{
            backgroundColor: "var(--white)",
            border: errors.address
              ? "1px solid rgb(239, 68, 68)"
              : "1px solid rgba(23, 28, 53, 0.1)",
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* City */}
          <Input
            label="Ciudad (City)"
            {...register("city")}
            error={errors.city?.message}
            placeholder="Ciudad"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.city
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />

          {/* State */}
          <Input
            label="Provincia/Estado (State)"
            {...register("state")}
            error={errors.state?.message}
            placeholder="Provincia o Estado"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.state
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Postal Code */}
          <Input
            label="Código Postal (Postal Code)"
            {...register("postalCode")}
            error={errors.postalCode?.message}
            placeholder="Código postal"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.postalCode
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />

          {/* Phone */}
          <Input
            label="Teléfono (Phone)"
            {...register("phone")}
            error={errors.phone?.message}
            placeholder="Teléfono"
            type="tel"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.phone
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />
        </div>

        {/* Botones */}
        <div className="pt-4 flex gap-4">
          <Button
            type="button"
            variant="outline-primary"
            size="lg"
            onClick={() => setCurrentStep(1)}
            className="rounded-lg flex-1"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!isValid}
            className="rounded-lg flex-1"
          >
            Continuar
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

