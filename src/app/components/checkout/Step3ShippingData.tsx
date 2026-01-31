"use client";

import { Controller } from "react-hook-form";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import TipoEntregaSelector from "./TipoEntregaSelector";
import AddressAutocomplete from "./AddressAutocomplete";
import { useStep3ShippingData } from "@/app/hooks/checkout/useStep3ShippingData";
import type { IDireccionDTO } from "@/app/types/direccion.type";

export default function Step3ShippingData() {
  const {
    form: { register, handleSubmit, errors, isValid, setValue, control },
    tipoEntrega,
    address,
    costoEnvio,
    provinciaOptions,
    direcciones,
    isAuthenticated,
    isSubmitting,
    selectedDireccionId,
    handleGoBack,
    onSubmit,
    handleDireccionSelect,
    isAddressVerified,
  } = useStep3ShippingData();

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

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        <TipoEntregaSelector
          selectedTipo={tipoEntrega}
          costoEnvio={costoEnvio}
          onSelect={(tipo) => setValue("tipoEntrega", tipo, { shouldValidate: true })}
          error={errors.tipoEntrega?.message}
        />

        {tipoEntrega === "envio" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4 pt-4 border-t"
            style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}
          >
            <h3 className="text-lg font-semibold text-foreground/90">Dirección de envío</h3>

            {isAuthenticated && direcciones.length > 0 && (
              <div className="mb-4 p-4 rounded-lg border bg-foreground/[0.03]" style={{ borderColor: "rgba(23, 28, 53, 0.1)" }}>
                <label className="block text-sm font-medium text-foreground mb-2">Seleccionar dirección guardada</label>
                <Select
                  options={[
                    // { value: "", label: "Usar dirección nueva" },
                    ...direcciones.map((d) => ({
                      value: d.id_direccion,
                      label: `${d.nombre || "Sin nombre"} - ${d.direccion} ${d.altura}${d.es_principal ? " (Principal)" : ""}`,
                    })),
                  ]}
                  value={selectedDireccionId || ""}
                  onChange={handleDireccionSelect}
                  placeholder="Seleccionar dirección"
                />
                <p className="text-xs text-foreground/50 mt-2">O completa los campos a continuación para usar una dirección nueva</p>
              </div>
            )}

            <AddressAutocomplete
              value={address || ""}
              onChange={(direccion: IDireccionDTO | null) => {
                if (direccion) {
                  if (direccion.calle) setValue("address", direccion.calle, { shouldValidate: true });
                  else if (direccion.direccion_formateada)
                    setValue("address", direccion.direccion_formateada.split("/")[0].trim(), { shouldValidate: true });
                  if (direccion.numero) setValue("altura", direccion.numero, { shouldValidate: true });
                  if (direccion.direccion_formateada) setValue("direccion_formateada", direccion.direccion_formateada);
                  if (direccion.latitud !== undefined) setValue("latitud", direccion.latitud);
                  if (direccion.longitud !== undefined) setValue("longitud", direccion.longitud);
                }
              }}
              error={errors.address?.message}
              label="Calle *"
              placeholder="Escribí tu calle (ej: San Martín, Córdoba)"
              onCityChange={(ciudad) => setValue("city", ciudad, { shouldValidate: true })}
              onProvinceChange={(provincia) => {
                const opt = provinciaOptions.find(
                  (o) =>
                    o.label.toLowerCase() === provincia.toLowerCase() ||
                    o.label.toLowerCase().includes(provincia.toLowerCase())
                );
                if (opt) {
                  const v = typeof opt.value === "number" ? String(opt.value) : (opt.value as string);
                  setValue("state", v, { shouldValidate: true });
                }
              }}
              onPostalCodeChange={(cp) => setValue("postalCode", cp, { shouldValidate: true })}
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

            <Input
              label="Código Postal *"
              {...register("postalCode")}
              error={errors.postalCode?.message}
              placeholder="5000"
              className="rounded-lg"
              style={{
                backgroundColor: "var(--white)",
                border: errors.postalCode ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
              }}
            />

            <input type="hidden" {...register("direccion_formateada")} />
            <input type="hidden" {...register("latitud", { valueAsNumber: true })} />
            <input type="hidden" {...register("longitud", { valueAsNumber: true })} />
          </motion.div>
        )}

        {tipoEntrega === "retiro" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-principal/10 border border-principal/20"
          >
            <p className="text-sm text-foreground/70">Retirarás tu pedido en nuestro local sin costo adicional.</p>
            <p className="text-xs text-foreground/50 mt-1">Te contactaremos cuando tu pedido esté listo para retirar.</p>
          </motion.div>
        )}

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline-primary" size="lg" onClick={handleGoBack} className="rounded-lg flex-1">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={
              !(isValid || (tipoEntrega === "envio" && selectedDireccionId)) ||
              !isAddressVerified ||
              isSubmitting
            }
            className="rounded-lg flex-1"
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
