"use client";

import { Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { ContactFormData } from "../schemas/contactForm.schema";
import Input from "@/app/components/ui/Input";
import Select, { SelectOption } from "@/app/components/ui/Select";

interface ShippingAddressSectionProps {
  register: UseFormRegister<ContactFormData>;
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  provinciaOptions: SelectOption[];
}

export function ShippingAddressSection({
  register,
  control,
  errors,
  provinciaOptions,
}: ShippingAddressSectionProps) {
  return (
    <div className="space-y-5 pt-4 border-t">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Dirección de envío</h3>

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
  );
}

