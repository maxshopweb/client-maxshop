"use client";

import { Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn } from "lucide-react";
import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import { GuestCheckoutButton } from "@/app/components/ui/GuestCheckoutButton";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import { usePersonalForm } from "@/app/hooks/checkout/usePersonalForm";
import { useAutoFillPersonalData } from "@/app/hooks/checkout/useAutoFillPersonalData";
import { useBillingDataPersonal } from "@/app/hooks/checkout/useBillingDataPersonal";
import { useGuestCheckoutPersonal } from "@/app/hooks/checkout/useGuestCheckoutPersonal";
import { useContactFormOptions } from "@/app/hooks/checkout/useContactFormOptions";
import { PersonalFormData } from "@/app/schemas/personalForm.schema";

export default function Step2PersonalInfo() {
  const { personalData, setPersonalData, setCurrentStep, completeStep } = useCheckoutStore();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Hooks de formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control,
  } = usePersonalForm();

  // Autocompletar datos del usuario
  useAutoFillPersonalData({
    isAuthenticated,
    user,
    personalData,
    setValue,
  });

  // Gestión de datos de facturación
  const {
    necesitaFacturaA,
    usarMismosDatos,
    setNecesitaFacturaA,
    setUsarMismosDatos,
  } = useBillingDataPersonal({ setValue, watch });

  // Gestión de checkout como invitado
  const {
    isGuestMode,
    isProcessingGuest,
    emailExistsError,
    handleContinueAsGuest,
    handleGuestFormSubmit,
    handleLogin,
  } = useGuestCheckoutPersonal({
    onSuccess: (data) => {
      setPersonalData(data);
      completeStep(2);
      setCurrentStep(3);
    },
  });

  // Opciones de selects
  const { tipoDocumentoOptions, provinciaOptions } = useContactFormOptions();

  // Handlers
  const onSubmit = (data: PersonalFormData) => {
    setPersonalData(data);
    completeStep(2);
    setCurrentStep(3);
  };

  // Mostrar loading mientras verifica auth
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
            <h3 className="text-xl font-bold text-foreground/90">
              Inicia sesión para continuar
            </h3>
          <p className="text-foreground/60">
            Puedes iniciar sesión o continuar como invitado para completar tu pedido
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <Button variant="primary" size="lg" onClick={handleLogin} className="rounded-lg w-full">
            Iniciar sesión
          </Button>
          <GuestCheckoutButton
            onClick={handleContinueAsGuest}
            loading={isProcessingGuest}
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setCurrentStep(1)}
          className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-foreground/90">Información personal</h2>
      </div>

      <form 
        onSubmit={isGuestMode ? handleSubmit(handleGuestFormSubmit as any) : handleSubmit(onSubmit as any)} 
        className="space-y-6"
      >
        {/* Información de contacto */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground/90 border-b pb-2">Datos personales</h3>

          {/* Email */}
          <div className="space-y-2">
            <Input
              label="Correo electrónico"
              type="email"
              {...register("email")}
              error={errors.email?.message || undefined}
              placeholder="correo@ejemplo.com"
              className="rounded-lg"
              style={{
                backgroundColor: "var(--white)",
                border: errors.email || emailExistsError
                  ? "1px solid rgb(239, 68, 68)"
                  : "1px solid rgba(23, 28, 53, 0.1)",
              }}
            />
            {emailExistsError && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <span>{emailExistsError}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="text-principal hover:text-principal/80 p-0 h-auto"
                >
                  Iniciar sesión
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* First Name */}
            <Input
              label="Nombre"
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
              label="Apellido"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Tipo de Documento */}
            <Controller
              name="tipoDocumento"
              control={control}
              render={({ field }) => (
                <Select
                  label="Tipo de Documento"
                  options={tipoDocumentoOptions}
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setValue("documento", "");
                  }}
                  placeholder="Seleccionar..."
                  error={errors.tipoDocumento?.message}
                />
              )}
            />

            {/* Documento */}
            <Input
              label={watch("tipoDocumento") === "CUIT" ? "CUIT" : "DNI"}
              {...register("documento")}
              error={errors.documento?.message}
              placeholder={watch("tipoDocumento") === "CUIT" ? "12345678901" : "12345678"}
              className="rounded-lg"
              style={{
                backgroundColor: "var(--white)",
                border: errors.documento
                  ? "1px solid rgb(239, 68, 68)"
                  : "1px solid rgba(23, 28, 53, 0.1)",
              }}
            />
          </div>

          {/* Phone */}
          <Input
            label="Número de Celular"
            type="tel"
            {...register("phone")}
            error={errors.phone?.message}
            placeholder="1123456789"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.phone
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />
        </div>

        {/* Opción de Facturación */}
        <div className="space-y-5 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground/90 border-b pb-2">Facturación</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={necesitaFacturaA}
                onChange={(e) => setNecesitaFacturaA(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-principal text-principal focus:ring-principal"
              />
              <span className="text-foreground font-medium">Necesito Factura A</span>
            </label>

            {necesitaFacturaA && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pl-8 border-l-2 border-principal/30"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usarMismosDatos}
                    onChange={(e) => setUsarMismosDatos(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-principal text-principal focus:ring-principal"
                  />
                  <span className="text-foreground">Usar los mismos datos de contacto</span>
                </label>

                {!usarMismosDatos && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <Input
                      label="Razón Social"
                      {...register("facturacionA.razonSocial")}
                      error={errors.facturacionA?.razonSocial?.message}
                      placeholder="Razón social"
                      className="rounded-lg"
                      style={{
                        backgroundColor: "var(--white)",
                        border: errors.facturacionA?.razonSocial
                          ? "1px solid rgb(239, 68, 68)"
                          : "1px solid rgba(23, 28, 53, 0.1)",
                      }}
                    />

                    <Input
                      label="Nombre de la Empresa"
                      {...register("facturacionA.nombreEmpresa")}
                      error={errors.facturacionA?.nombreEmpresa?.message}
                      placeholder="Nombre de la empresa"
                      className="rounded-lg"
                      style={{
                        backgroundColor: "var(--white)",
                        border: errors.facturacionA?.nombreEmpresa
                          ? "1px solid rgb(239, 68, 68)"
                          : "1px solid rgba(23, 28, 53, 0.1)",
                      }}
                    />

                    <Input
                      label="CUIT"
                      {...register("facturacionA.cuit")}
                      error={errors.facturacionA?.cuit?.message}
                      placeholder="12345678901"
                      className="rounded-lg"
                      style={{
                        backgroundColor: "var(--white)",
                        border: errors.facturacionA?.cuit
                          ? "1px solid rgb(239, 68, 68)"
                          : "1px solid rgba(23, 28, 53, 0.1)",
                      }}
                    />
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
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
      </form>
    </motion.div>
  );
}


