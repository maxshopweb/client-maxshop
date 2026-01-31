"use client";

import { useState } from "react";
import { Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";

import { PersonalFormData, PersonalFormDataAuthUser } from "@/app/schemas/personalForm.schema";
import { personalDataFromAuthUser } from "@/app/utils/personalDataFromAuthUser";

import { useCheckoutStore } from "@/app/hooks/checkout/useCheckoutStore";
import { useAuth } from "@/app/context/AuthContext";
import { GuestCheckoutButton } from "@/app/components/ui/GuestCheckoutButton";
import { usePersonalForm } from "@/app/hooks/checkout/usePersonalForm";
import { usePersonalFormAuthUser } from "@/app/hooks/checkout/usePersonalFormAuthUser";
import { useAutoFillPersonalData } from "@/app/hooks/checkout/useAutoFillPersonalData";
import { useBillingDataPersonal } from "@/app/hooks/checkout/useBillingDataPersonal";
import { useBillingDataPersonalAuthUser } from "@/app/hooks/checkout/useBillingDataPersonalAuthUser";
import { useGuestCheckoutPersonal } from "@/app/hooks/checkout/useGuestCheckoutPersonal";
import { useContactFormOptions } from "@/app/hooks/checkout/useContactFormOptions";

export default function Step2PersonalInfo() {
  const { personalData, setPersonalData, setCurrentStep, completeStep } = useCheckoutStore();
  const { user, isAuthenticated, isGuest, loading: authLoading } = useAuth();

  /** Usuario logueado (no invitado): ya tenemos sus datos, solo pedimos DNI + facturación */
  const isLoggedUser = isAuthenticated && !!user && !isGuest;

  // Estados para notificaciones en tiempo real
  const [phoneAreaError, setPhoneAreaError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

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

  // Formulario reducido para usuario logueado (solo DNI + facturación)
  const formAuth = usePersonalFormAuthUser();
  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    formState: { errors: errorsAuth, isValid: isValidAuth },
    setValue: setValueAuth,
    watch: watchAuth,
    control: controlAuth,
  } = formAuth;
  const {
    necesitaFacturaA: necesitaFacturaAAuth,
    usarMismosDatos: usarMismosDatosAuth,
    setNecesitaFacturaA: setNecesitaFacturaAAuth,
    setUsarMismosDatos: setUsarMismosDatosAuth,
  } = useBillingDataPersonalAuthUser({
    user,
    setValue: formAuth.setValue,
    watch: formAuth.watch,
  });

  // Opciones de selects
  const { tipoDocumentoOptions, provinciaOptions } = useContactFormOptions();

  // Handlers
  const onSubmit = (data: PersonalFormData) => {
    setPersonalData(data);
    completeStep(2);
    setCurrentStep(3);
  };

  const onSubmitAuthUser = (data: PersonalFormDataAuthUser) => {
    if (!user) return;
    const merged = personalDataFromAuthUser(user, data);
    setPersonalData(merged);
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
        <Button
          type="button"
          variant="ghost"
          size="lg"
          onClick={() => setCurrentStep(1)}
          className="rounded-lg flex-1"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </motion.div>
    );
  }

  // Usuario logueado (no invitado): solo DNI + facturación
  if (isLoggedUser) {
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

        {/* <p className="text-foreground/70 text-sm">
          Completando con {user?.nombre} {user?.apellido} ({user?.email})
        </p> */}

        <form onSubmit={handleSubmitAuth(onSubmitAuthUser as any)} className="space-y-6">
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-foreground/90 border-b pb-2">Documento y facturación</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Controller
                name="tipoDocumento"
                control={controlAuth}
                render={({ field }) => (
                  <Select
                    label="Tipo de documento"
                    options={tipoDocumentoOptions}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      setValueAuth("documento", "");
                    }}
                    placeholder="Seleccionar..."
                    error={errorsAuth.tipoDocumento?.message}
                  />
                )}
              />
              <Input
                label={watchAuth("tipoDocumento") === "CUIT" ? "CUIT" : "DNI"}
                {...registerAuth("documento")}
                error={errorsAuth.documento?.message}
                placeholder={watchAuth("tipoDocumento") === "CUIT" ? "12345678901" : "12345678"}
                className="rounded-lg"
                style={{
                  backgroundColor: "var(--white)",
                  border: errorsAuth.documento
                    ? "1px solid rgb(239, 68, 68)"
                    : "1px solid rgba(23, 28, 53, 0.1)",
                }}
              />
            </div>
          </div>

          <div className="space-y-5 pt-4 border-t">
            <h3 className="text-lg font-semibold text-foreground/90 border-b pb-2">Facturación</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={necesitaFacturaAAuth}
                  onChange={(e) => {
                    setNecesitaFacturaAAuth(e.target.checked);
                    setTimeout(() => {
                      setValueAuth("necesitaFacturaA", e.target.checked, { shouldValidate: true });
                    }, 0);
                  }}
                  className="w-5 h-5 rounded border-2 border-principal text-principal focus:ring-principal"
                />
                <span className="text-foreground font-medium">Necesito Factura A</span>
              </label>
              {necesitaFacturaAAuth && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pl-8 border-l-2 border-principal/30"
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usarMismosDatosAuth}
                      onChange={(e) => {
                        setUsarMismosDatosAuth(e.target.checked);
                        setTimeout(() => {
                          setValueAuth("usarMismosDatosFacturacion", e.target.checked, { shouldValidate: true });
                        }, 0);
                      }}
                      className="w-5 h-5 rounded border-2 border-principal text-principal focus:ring-principal"
                    />
                    <span className="text-foreground">Usar los mismos datos de contacto</span>
                  </label>
                  {!usarMismosDatosAuth && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <Input
                        label="Razón Social"
                        {...registerAuth("facturacionA.razonSocial")}
                        error={errorsAuth.facturacionA?.razonSocial?.message}
                        placeholder="Razón social"
                        className="rounded-lg"
                        style={{
                          backgroundColor: "var(--white)",
                          border: errorsAuth.facturacionA?.razonSocial
                            ? "1px solid rgb(239, 68, 68)"
                            : "1px solid rgba(23, 28, 53, 0.1)",
                        }}
                      />
                      <Input
                        label="Nombre de la Empresa"
                        {...registerAuth("facturacionA.nombreEmpresa")}
                        error={errorsAuth.facturacionA?.nombreEmpresa?.message}
                        placeholder="Nombre de la empresa"
                        className="rounded-lg"
                        style={{
                          backgroundColor: "var(--white)",
                          border: errorsAuth.facturacionA?.nombreEmpresa
                            ? "1px solid rgb(239, 68, 68)"
                            : "1px solid rgba(23, 28, 53, 0.1)",
                        }}
                      />
                      <Input
                        label="CUIT"
                        {...registerAuth("facturacionA.cuit")}
                        error={errorsAuth.facturacionA?.cuit?.message}
                        placeholder="12345678901"
                        className="rounded-lg"
                        style={{
                          backgroundColor: "var(--white)",
                          border: errorsAuth.facturacionA?.cuit
                            ? "1px solid rgb(239, 68, 68)"
                            : "1px solid rgba(23, 28, 53, 0.1)",
                        }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
              {errorsAuth.facturacionA && typeof errorsAuth.facturacionA === "object" && "message" in errorsAuth.facturacionA && (
                <p className="text-sm text-red-600">{errorsAuth.facturacionA.message as string}</p>
              )}
            </div>
          </div>

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
              disabled={!isValidAuth}
              className="rounded-lg flex-1"
            >
              Continuar
            </Button>
          </div>
        </form>
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
            {/* Tipo de documento */}
            <Controller
              name="tipoDocumento"
              control={control}
              render={({ field }) => (
                <Select
                  label="Tipo de documento"
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Número de celular
            </label>

            <div className="grid grid-cols-[120px_1fr] gap-3">
              {/* Código de área (sin 0) */}
              <div className="space-y-1">
                <Input
                  label="Área"
                  placeholder="11"
                  inputMode="numeric"
                  maxLength={4}
                  {...register("phoneArea")}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");

                    // Detectar y notificar si empieza con 0
                    if (value.startsWith('0')) {
                      setPhoneAreaError('No debe comenzar con 0');
                      value = value.slice(1); // Remover el 0
                    } else {
                      setPhoneAreaError(null);
                    }

                    setValue("phoneArea", value, { shouldValidate: true });
                  }}
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.phoneArea || phoneAreaError
                      ? "1px solid rgb(239, 68, 68)"
                      : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />
                <p className="text-xs text-foreground/60">
                  Sin <strong>0</strong>. Ej: <code>351</code>
                </p>
              </div>

              {/* Número (sin 15) */}
              <div className="space-y-1">
                <Input
                  label="Celular"
                  placeholder="2345678"
                  inputMode="numeric"
                  maxLength={8}
                  {...register("phone")}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");

                    // Detectar y notificar si empieza con 15
                    if (value.startsWith('15')) {
                      setPhoneError('No debe comenzar con 15');
                      value = value.slice(2); // Remover el 15
                    } else {
                      setPhoneError(null);
                    }

                    // Solo guardar el número, sin concatenar el área
                    setValue("phone", value, { shouldValidate: true });
                  }}
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.phone || phoneError
                      ? "1px solid rgb(239, 68, 68)"
                      : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />
                <p className="text-xs text-foreground/60">
                  Sin <strong>15</strong>. Ej: <code>12345678</code>
                </p>
              </div>
            </div>

            {(errors.phone || errors.phoneArea || phoneAreaError || phoneError) && (
              <div className="space-y-1">
                {errors.phoneArea && (
                  <p className="text-sm text-red-600">{errors.phoneArea.message}</p>
                )}
                {phoneAreaError && !errors.phoneArea && (
                  <p className="text-sm text-red-600">{phoneAreaError}</p>
                )}
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
                {phoneError && !errors.phone && (
                  <p className="text-sm text-red-600">{phoneError}</p>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Opción de Facturación */}
        <div className="space-y-5 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground/90 border-b pb-2">Facturación</h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={necesitaFacturaA}
                onChange={(e) => {
                  setNecesitaFacturaA(e.target.checked);
                  // Forzar validación después de cambiar
                  setTimeout(() => {
                    setValue("necesitaFacturaA", e.target.checked, { shouldValidate: true });
                  }, 0);
                }}
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
                    onChange={(e) => {
                      setUsarMismosDatos(e.target.checked);
                      // Forzar validación después de cambiar
                      setTimeout(() => {
                        setValue("usarMismosDatosFacturacion", e.target.checked, { shouldValidate: true });
                      }, 0);
                    }}
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

            {/* Mostrar error de facturación si existe */}
            {errors.facturacionA && typeof errors.facturacionA === 'object' && 'message' in errors.facturacionA && (
              <p className="text-sm text-red-600">{errors.facturacionA.message as string}</p>
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


