"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutStore } from "../hooks/useCheckoutStore";
import { contactFormSchema, ContactFormData } from "../schemas/contactForm.schema";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select, { SelectOption } from "@/app/components/ui/Select";
import { provincias } from "@/app/utils/ubicaciones";
import { LogIn, ArrowLeft } from "lucide-react";

export default function Step2ContactForm() {
  const router = useRouter();
  const { contactData, setContactData, setCurrentStep, completeStep } = useCheckoutStore();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const [necesitaFacturaA, setNecesitaFacturaA] = useState(false);
  const [usarMismosDatos, setUsarMismosDatos] = useState(true);
  const [mismaDireccionEnvio, setMismaDireccionEnvio] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onChange",
    defaultValues: contactData || {
      email: "",
      firstName: "",
      lastName: "",
      tipoDocumento: "DNI",
      documento: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      necesitaFacturaA: false,
      usarMismosDatosFacturacion: true,
      mismaDireccionEnvio: true,
    },
  });

  const watchedValues = watch();

  // Autocompletar con datos del usuario si está autenticado
  useEffect(() => {
    if (isAuthenticated && user && !contactData) {
      setValue("email", user.email || "");
      setValue("firstName", user.nombre || "");
      setValue("lastName", user.apellido || "");
      setValue("phone", user.telefono?.toString() || "");
    }
  }, [isAuthenticated, user, contactData, setValue]);

  // Sincronizar estado local con form
  useEffect(() => {
    setValue("necesitaFacturaA", necesitaFacturaA);
  }, [necesitaFacturaA, setValue]);

  useEffect(() => {
    setValue("usarMismosDatosFacturacion", usarMismosDatos);
  }, [usarMismosDatos, setValue]);

  useEffect(() => {
    setValue("mismaDireccionEnvio", mismaDireccionEnvio);
  }, [mismaDireccionEnvio, setValue]);

  // Si usa los mismos datos, copiar información
  useEffect(() => {
    if (necesitaFacturaA && usarMismosDatos) {
      setValue("facturacionA.razonSocial", watchedValues.firstName + " " + watchedValues.lastName);
      setValue("facturacionA.nombreEmpresa", watchedValues.firstName + " " + watchedValues.lastName);
      setValue("facturacionA.cuit", watchedValues.tipoDocumento === "CUIT" ? watchedValues.documento : "");
    }
  }, [necesitaFacturaA, usarMismosDatos, watchedValues, setValue]);

  // Si es la misma dirección de envío, copiar dirección
  useEffect(() => {
    if (necesitaFacturaA && mismaDireccionEnvio && watchedValues.facturacionA) {
      setValue("facturacionA.domicilioFiscal", watchedValues.address);
      setValue("facturacionA.ciudadFiscal", watchedValues.city);
      setValue("facturacionA.provinciaFiscal", watchedValues.state);
      setValue("facturacionA.codigoPostalFiscal", watchedValues.postalCode);
    }
  }, [necesitaFacturaA, mismaDireccionEnvio, watchedValues, setValue]);

  const onSubmit = (data: ContactFormData) => {
    setContactData(data);
    completeStep(2);
    setCurrentStep(3);
  };

  const handleLogin = () => {
    router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
  };

  // Opciones de provincias para el select
  const provinciaOptions: SelectOption[] = provincias.map((p) => ({
    value: p.value,
    label: p.label,
  }));

  // Opciones de tipo de documento
  const tipoDocumentoOptions: SelectOption[] = [
    { value: "DNI", label: "DNI" },
    { value: "CUIT", label: "CUIT" },
  ];

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
          Iniciar sesión
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información de Contacto */}
        <div className="space-y-5">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Datos Personales</h3>
          
          {/* Email */}
          <Input
            label="Correo electrónico"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="correo@ejemplo.com"
            className="rounded-lg"
            style={{
              backgroundColor: "var(--white)",
              border: errors.email
                ? "1px solid rgb(239, 68, 68)"
                : "1px solid rgba(23, 28, 53, 0.1)",
            }}
          />

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
                    setValue("documento", ""); // Limpiar documento al cambiar tipo
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

        {/* Dirección de Envío */}
        <div className="space-y-5 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dirección de Envío</h3>
          
          {/* Address */}
          <Input
            label="Dirección"
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
              label="Ciudad"
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

            {/* State - Select */}
            <Controller
              name="state"
              control={control}
              render={({ field }) => (
                <Select
                  label="Provincia"
                  options={provinciaOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Seleccionar provincia"
                  error={errors.state?.message}
                />
              )}
            />
          </div>

          {/* Postal Code */}
          <Input
            label="Código Postal"
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
        </div>

        {/* Opción de Facturación */}
        <div className="space-y-5 pt-4 border-t">
          <h3 className="text-lg font-semibold text-foreground border-b pb-2">Facturación</h3>
          
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={necesitaFacturaA}
                onChange={(e) => {
                  setNecesitaFacturaA(e.target.checked);
                  if (!e.target.checked) {
                    setUsarMismosDatos(true);
                    setMismaDireccionEnvio(true);
                  }
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
                      if (e.target.checked) {
                        setMismaDireccionEnvio(true);
                      }
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

                {/* Domicilio Fiscal */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mismaDireccionEnvio}
                      onChange={(e) => setMismaDireccionEnvio(e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-principal text-principal focus:ring-principal"
                    />
                    <span className="text-foreground">Misma dirección de envío</span>
                  </label>

                  {!mismaDireccionEnvio && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <Input
                        label="Domicilio Fiscal"
                        {...register("facturacionA.domicilioFiscal")}
                        error={errors.facturacionA?.domicilioFiscal?.message}
                        placeholder="Dirección fiscal completa"
                        className="rounded-lg"
                        style={{
                          backgroundColor: "var(--white)",
                          border: errors.facturacionA?.domicilioFiscal
                            ? "1px solid rgb(239, 68, 68)"
                            : "1px solid rgba(23, 28, 53, 0.1)",
                        }}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                          label="Ciudad Fiscal"
                          {...register("facturacionA.ciudadFiscal")}
                          error={errors.facturacionA?.ciudadFiscal?.message}
                          placeholder="Ciudad"
                          className="rounded-lg"
                          style={{
                            backgroundColor: "var(--white)",
                            border: errors.facturacionA?.ciudadFiscal
                              ? "1px solid rgb(239, 68, 68)"
                              : "1px solid rgba(23, 28, 53, 0.1)",
                          }}
                        />

                        <Controller
                          name="facturacionA.provinciaFiscal"
                          control={control}
                          render={({ field }) => (
                            <Select
                              label="Provincia Fiscal"
                              options={provinciaOptions}
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Seleccionar provincia"
                              error={errors.facturacionA?.provinciaFiscal?.message}
                            />
                          )}
                        />
                      </div>

                      <Input
                        label="Código Postal Fiscal"
                        {...register("facturacionA.codigoPostalFiscal")}
                        error={errors.facturacionA?.codigoPostalFiscal?.message}
                        placeholder="Código postal"
                        className="rounded-lg"
                        style={{
                          backgroundColor: "var(--white)",
                          border: errors.facturacionA?.codigoPostalFiscal
                            ? "1px solid rgb(239, 68, 68)"
                            : "1px solid rgba(23, 28, 53, 0.1)",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
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
