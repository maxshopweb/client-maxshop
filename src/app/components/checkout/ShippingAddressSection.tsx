"use client";

import { Controller, UseFormRegister, Control, FieldErrors } from "react-hook-form";
import { ContactFormData } from "@/app/schemas/contactForm.schema";
import Input from "@/app/components/ui/Input";
import Select, { SelectOption } from "@/app/components/ui/Select";
import AddressAutocomplete from "./AddressAutocomplete";
import type { IDireccionDTO } from "@/app/types/direccion.type";

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
  setValue,
  watch,
}: ShippingAddressSectionProps) {
  // Valor actual de la dirección
  const addressValue = watch("address");

  // Manejar cambio de dirección desde el autocomplete
  const handleAddressChange = (direccion: IDireccionDTO | null) => {
    if (direccion) {
      // Guardar la dirección formateada como address
      if (direccion.direccion_formateada) {
        setValue("address", direccion.direccion_formateada, { shouldValidate: true });
      } else if (direccion.direccion_usuario) {
        setValue("address", direccion.direccion_usuario, { shouldValidate: true });
      }
      
      // Guardar datos de geocodificación
      if (direccion.direccion_formateada) {
        setValue("direccion_formateada", direccion.direccion_formateada);
      }
      if (direccion.latitud !== undefined) {
        setValue("latitud", direccion.latitud);
      }
      if (direccion.longitud !== undefined) {
        setValue("longitud", direccion.longitud);
      }
    } else {
      // Limpiar campos de geocodificación si se limpia la dirección
      setValue("direccion_formateada", undefined);
      setValue("latitud", undefined);
      setValue("longitud", undefined);
    }
  };

  // Manejar cambios de ciudad, provincia y código postal
  const handleCityChange = (ciudad: string) => {
    setValue("city", ciudad, { shouldValidate: true });
  };

  const handleProvinceChange = (provincia: string) => {
    // Buscar el código de provincia en las opciones
    const provinciaOption = provinciaOptions.find(
      (opt) => opt.label.toLowerCase() === provincia.toLowerCase()
    );
    if (provinciaOption) {
      setValue("state", provinciaOption.value, { shouldValidate: true });
    } else {
      // Si no encuentra exacto, intentar match parcial
      const partialMatch = provinciaOptions.find(
        (opt) => opt.label.toLowerCase().includes(provincia.toLowerCase()) ||
                 provincia.toLowerCase().includes(opt.label.toLowerCase())
      );
      if (partialMatch) {
        setValue("state", partialMatch.value, { shouldValidate: true });
      }
    }
  };

  const handlePostalCodeChange = (codPostal: string) => {
    setValue("postalCode", codPostal, { shouldValidate: true });
  };

  return (
    <div className="space-y-4 sm:space-y-5 pt-4 border-t">
      <h3 className="text-base sm:text-lg font-semibold text-foreground border-b pb-2">
        Dirección de envío
      </h3>

      {/* Address Autocomplete */}
      <AddressAutocomplete
        value={addressValue}
        onChange={handleAddressChange}
        error={errors.address?.message}
        label="Dirección"
        placeholder="Escribí tu dirección (ej: San Martín 123, Córdoba)"
        onCityChange={handleCityChange}
        onProvinceChange={handleProvinceChange}
        onPostalCodeChange={handlePostalCodeChange}
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

