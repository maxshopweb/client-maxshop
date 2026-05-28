"use client";

import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import TipoEntregaSelector from "./TipoEntregaSelector";
import { StorePickupInfo } from "./StorePickupInfo";
import { useStep3ShippingData } from "@/app/hooks/checkout/useStep3ShippingData";
import { usePostalCodeSearch } from "@/app/hooks/cart/usePostalCodeSearch";
import { WhatsappLink } from "@/app/components/contact/ContactLinks";
import { CheckoutFormSection } from "@/app/components/checkout/CheckoutFormSection";

export default function Step3ShippingData() {
  const isAndreaniManualMode = process.env.NEXT_PUBLIC_ANDREANI_MODO_MANUAL === "true";
  const {
    form: { register, handleSubmit, errors, setValue, control, watch },
    tipoEntrega,
    costoEnvio,
    provinciaOptions,
    direcciones,
    isAuthenticated,
    isSubmitting,
    selectedDireccionId,
    usarMismaDireccionFacturacion,
    handleGoBack,
    onSubmit,
    handleDireccionSelect,
    handleUsarMismaDireccionChange,
    isAddressVerified,
  } = useStep3ShippingData();

  const { searchByPostalCode, setAddressDataStore, isLoading: isLoadingCp, error: errorCp, foundData } = usePostalCodeSearch();
  const postalCodeWatch = watch("postalCode");

  const handleBuscarCp = async () => {
    const cp = typeof postalCodeWatch === "string" ? postalCodeWatch.trim() : "";
    if (!/^[0-9]{4}$/.test(cp)) return;
    await searchByPostalCode(cp);
    await setAddressDataStore(cp);
  };

  useEffect(() => {
    if (!foundData || tipoEntrega !== "envio") return;
    setValue("city", foundData.ciudad ?? "", { shouldValidate: true });
    if (foundData.provincia) {
      const opt = provinciaOptions.find(
        (o) =>
          o.label.toLowerCase() === foundData.provincia?.toLowerCase() ||
          foundData.provincia?.toLowerCase().includes(o.label.toLowerCase())
      );
      if (opt) setValue("state", typeof opt.value === "number" ? String(opt.value) : opt.value, { shouldValidate: true });
    }
  }, [foundData?.ciudad, foundData?.provincia, tipoEntrega, provinciaOptions, setValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={handleGoBack} className="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-foreground/90">Datos de envío</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit as any, (err) => console.error("Validation errors:", err))}
        className="space-y-8"
      >
        <CheckoutFormSection title="Tipo de entrega">
          <TipoEntregaSelector
            selectedTipo={tipoEntrega}
            costoEnvio={costoEnvio}
            onSelect={(tipo) => setValue("tipoEntrega", tipo, { shouldValidate: true })}
            error={errors.tipoEntrega?.message}
            hideLabel
          />
        </CheckoutFormSection>

        {tipoEntrega === "retiro" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CheckoutFormSection title="Retiro en local">
              <StorePickupInfo />
            </CheckoutFormSection>
          </motion.div>
        )}

        {tipoEntrega === "envio" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CheckoutFormSection title="Dirección de envío">
            {isAndreaniManualMode && (
              <div className="rounded-lg border bg-foreground/[0.03] px-3 py-2 text-sm text-foreground/80" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}>
                <p>
                  Envío a domicilio disponible. El costo se confirmará por{" "}
                  <WhatsappLink className="text-principal underline underline-offset-2 hover:opacity-80" />.
                </p>
                <p>El código de seguimiento se enviará una vez despachado.</p>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!usarMismaDireccionFacturacion}
                onChange={(e) => handleUsarMismaDireccionChange(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-principal text-principal focus:ring-principal"
              />
              <span className="text-foreground">Usar la misma dirección de facturación</span>
            </label>

            {!usarMismaDireccionFacturacion && (
              <>
                {isAuthenticated && direcciones.length > 0 && (
                  <div className="mb-4 p-4 rounded-lg border bg-foreground/[0.03]" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}>
                    <label className="block text-sm font-medium text-foreground mb-2">Seleccionar dirección guardada</label>
                    <Select
                      options={direcciones.map((d) => ({
                        value: d.id_direccion,
                        label: `${d.nombre || "Sin nombre"} - ${d.direccion} ${d.altura}${d.es_principal ? " (Principal)" : ""}`,
                      }))}
                      value={selectedDireccionId || ""}
                      onChange={handleDireccionSelect}
                      placeholder="Seleccionar dirección"
                    />
                    <p className="text-xs text-foreground/50 mt-2">O completa los campos a continuación para usar una dirección nueva</p>
                  </div>
                )}

                <Input
                  label="Calle *"
                  {...register("address")}
                  error={errors.address?.message}
                  placeholder="Ej: San Martín, Av. Corrientes"
                  className="rounded-lg"
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.address ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />

                <div className="grid grid-cols-3 gap-4 items-end">
                  <Input
                    label="Altura *"
                    {...register("altura")}
                    error={errors.altura?.message}
                    placeholder="123"
                    className="rounded-lg"
                    style={{
                      backgroundColor: "var(--white)",
                      border: errors.altura ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
                    }}
                  />
                  <Input
                    label="Piso (opcional)"
                    maxLength={20}
                    {...register("piso")}
                    error={errors.piso?.message}
                    placeholder="1"
                    className="rounded-lg"
                    style={{
                      backgroundColor: "var(--white)",
                      border: errors.piso ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
                    }}
                  />
                  <Input
                    label="Dpto (opcional)"
                    maxLength={20}
                    {...register("dpto")}
                    error={errors.dpto?.message}
                    placeholder="A"
                    className="rounded-lg"
                    style={{
                      backgroundColor: "var(--white)",
                      border: errors.dpto ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <Select
                        label="Provincia *"
                        options={provinciaOptions}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Seleccionar provincia"
                        error={errors.state?.message}
                      />
                    )}
                  />
                  <Input
                    label="Ciudad *"
                    {...register("city")}
                    error={errors.city?.message}
                    placeholder="Ciudad"
                    className="rounded-lg"
                    style={{
                      backgroundColor: "var(--white)",
                      border: errors.city ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
                    }}
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <div className="flex gap-2 items-end">
                <Input
                  label="Código Postal *"
                  {...register("postalCode")}
                  error={errors.postalCode?.message || errorCp || undefined}
                  placeholder="5000"
                  className="rounded-lg flex-1"
                  style={{
                    backgroundColor: "var(--white)",
                    border: errors.postalCode || errorCp ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
                  }}
                />
                <Button
                  type="button"
                  variant="outline-primary"
                  size="md"
                  className="shrink-0 h-11 min-h-11 rounded-lg"
                  onClick={handleBuscarCp}
                  disabled={!postalCodeWatch || !/^[0-9]{4}$/.test(String(postalCodeWatch).trim()) || isLoadingCp}
                >
                  {isLoadingCp ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-1" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-foreground/60">Ingresá tu CP y tocá Buscar para completar localidad y provincia.</p>
            </div>

            <input type="hidden" {...register("direccion_formateada")} />
            <input type="hidden" {...register("latitud", { valueAsNumber: true })} />
            <input type="hidden" {...register("longitud", { valueAsNumber: true })} />
            </CheckoutFormSection>
          </motion.div>
        )}

        <div className="flex gap-4 pt-2">
          <Button type="button" variant="outline-primary" size="lg" onClick={handleGoBack} className="rounded-lg flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={!tipoEntrega || (tipoEntrega === "envio" && !isAddressVerified) || isSubmitting}
            className="rounded-lg flex-1"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit as any, (err) => console.error("Validation errors:", err))(e);
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Procesando...</span>
              </>
            ) : tipoEntrega === "envio" && selectedDireccionId ? (
              "Continuar"
            ) : tipoEntrega === "envio" ? (
              "Confirmar dirección"
            ) : (
              "Continuar"
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
