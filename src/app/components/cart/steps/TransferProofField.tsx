"use client";

import { IFormFieldConfig } from "@/app/types/cart.type";
import { IDatosPago } from "@/app/types/cart.type";

interface TransferProofFieldProps {
  field: IFormFieldConfig;
  formData: Partial<IDatosPago>;
  onChange: (name: string, value: File | null) => void;
  error?: string;
}

export function TransferProofField({ field, formData, onChange, error }: TransferProofFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-foreground/90">
        {field.label}
        {field.required && <span className="text-principal ml-1">*</span>}
      </label>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onChange(field.name, file);
        }}
        className="w-full px-4 py-3 bg-input/50 rounded-lg text-sm text-foreground border border-input/50 focus:border-principal/50 focus:ring-2 focus:ring-principal/20 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-principal file:text-white hover:file:bg-principal/90"
      />
      {formData.comprobante && (
        <p className="text-sm text-foreground/60 mt-2">
          Archivo seleccionado: {formData.comprobante instanceof File ? formData.comprobante.name : 'N/A'}
        </p>
      )}
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

