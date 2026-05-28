"use client";

import { Controller, Control, FieldErrors, UseFormRegister } from "react-hook-form";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import type { BillingAddressData } from "@/app/schemas/billingAddress.schema";
import type { SelectOption } from "@/app/components/ui/Select";

interface BillingAddressFieldsProps {
  register: UseFormRegister<BillingAddressData>;
  control: Control<BillingAddressData>;
  errors: FieldErrors<BillingAddressData>;
  provinciaOptions: SelectOption[];
  showPostalCode?: boolean;
  savedAddressSelector?: React.ReactNode;
}

export function BillingAddressFields({
  register,
  control,
  errors,
  provinciaOptions,
  showPostalCode = true,
  savedAddressSelector,
}: BillingAddressFieldsProps) {
  return (
    <div className="space-y-4">
      {savedAddressSelector}

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

      {showPostalCode && (
        <Input
          label="Código Postal (opcional)"
          {...register("postalCode")}
          error={errors.postalCode?.message}
          placeholder="5000"
          className="rounded-lg"
          style={{
            backgroundColor: "var(--white)",
            border: errors.postalCode ? "1px solid rgb(239, 68, 68)" : "1px solid rgba(23, 28, 53, 0.1)",
          }}
        />
      )}
    </div>
  );
}
