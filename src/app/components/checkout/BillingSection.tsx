"use client";

import { motion } from "framer-motion";
import { Controller, UseFormRegister, UseFormWatch, Control, FieldErrors } from "react-hook-form";
import { ContactFormData } from "../../schemas/contactForm.schema";
import Input from "@/app/components/ui/Input";
import Select, { SelectOption } from "@/app/components/ui/Select";

interface BillingSectionProps {
  register: UseFormRegister<ContactFormData>;
  control: Control<ContactFormData>;
  watch: UseFormWatch<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  necesitaFacturaA: boolean;
  usarMismosDatos: boolean;
  mismaDireccionEnvio: boolean;
  setNecesitaFacturaA: (checked: boolean) => void;
  setUsarMismosDatos: (checked: boolean) => void;
  setMismaDireccionEnvio: (checked: boolean) => void;
  provinciaOptions: SelectOption[];
}

export function BillingSection({
  register,
  control,
  watch,
  errors,
  necesitaFacturaA,
  usarMismosDatos,
  mismaDireccionEnvio,
  setNecesitaFacturaA,
  setUsarMismosDatos,
  setMismaDireccionEnvio,
  provinciaOptions,
}: BillingSectionProps) {
  return (
    <div className="space-y-5 pt-4 border-t">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Facturación</h3>

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
  );
}

