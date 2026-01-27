"use client";

import { Controller, UseFormRegister, UseFormWatch, Control, FieldErrors } from "react-hook-form";
import { ContactFormData } from "../schemas/contactForm.schema";
import Input from "@/app/components/ui/Input";
import Select, { SelectOption } from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";

interface ContactPersonalSectionProps {
  register: UseFormRegister<ContactFormData>;
  control: Control<ContactFormData>;
  watch: UseFormWatch<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  setValue: (name: keyof ContactFormData, value: any) => void;
  emailExistsError: string | null;
  onLogin: () => void;
  tipoDocumentoOptions: SelectOption[];
}

export function ContactPersonalSection({
  register,
  control,
  watch,
  errors,
  setValue,
  emailExistsError,
  onLogin,
  tipoDocumentoOptions,
}: ContactPersonalSectionProps) {
  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">Datos personales</h3>

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
              onClick={onLogin}
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
        label="Número de celular"
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
  );
}

