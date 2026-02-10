"use client";

import { Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { ContactFormData } from "@/app/schemas/contactForm.schema";
import Input from "@/app/components/ui/Input";
import Select, { SelectOption } from "@/app/components/ui/Select";

interface ShippingAddressSectionProps {
  register: UseFormRegister<ContactFormData>;
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  provinciaOptions: SelectOption[];
  setValue: (name: keyof ContactFormData, value: any, options?: { shouldValidate?: boolean }) => void;
  watch: (name: keyof ContactFormData) => any;
}

export function ShippingAddressSection({
  register,
  control,
  errors,
  provinciaOptions,
}: ShippingAddressSectionProps) {
  return (
    <div className="space-y-4 sm:space-y-5 pt-4 border-t">
      <h3 className="text-base sm:text-lg font-semibold text-foreground border-b pb-2">
        Dirección de envío
      </h3>

      <Input
        label="Dirección (calle y número)"
        {...register("address")}
        error={errors.address?.message}
        placeholder="Ej: San Martín 123, Av. Corrientes 1500"
        className="rounded-lg"
        style={{
          backgroundColor: "var(--white)",
          border: errors.address ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
        }}
      />

      {/* Grid responsivo: 1 columna en mobile, 2 en desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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

      {/* Postal Code - Ancho completo en mobile */}
      <div className="w-full sm:w-1/2 sm:pr-2.5">
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

      {/* Campos ocultos para datos de geocodificación */}
      <input type="hidden" {...register("direccion_formateada")} />
      <input type="hidden" {...register("latitud", { valueAsNumber: true })} />
      <input type="hidden" {...register("longitud", { valueAsNumber: true })} />
    </div>
  );
}

