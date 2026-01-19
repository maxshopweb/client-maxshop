"use client";

import { Check, X } from "lucide-react";
import Input from "@/app/components/ui/Input";
import Select from "@/app/components/ui/Select";
import { Button } from "@/app/components/ui/Button";
import { useContactFormOptions } from "@/app/hooks/checkout/useContactFormOptions";
import type { ICreateDireccionDTO } from "@/app/services/direcciones.service";

interface AddressFormProps {
  formData: ICreateDireccionDTO;
  setFormData: (data: ICreateDireccionDTO) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  checkboxId?: string;
  isPrincipal?: boolean; // Indica si la dirección ya es principal
  hasChanges?: boolean; // Indica si hay cambios en el formulario
}

export default function AddressForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  checkboxId = "es_principal",
  isPrincipal = false,
  hasChanges = true,
}: AddressFormProps) {
  const { provinciaOptions } = useContactFormOptions();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Nombre (alias)"
        value={formData.nombre || ""}
        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        placeholder="Ej: Casa, Trabajo"
      />
      <Input
        label="Calle *"
        value={formData.direccion || ""}
        onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        required
      />
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Altura *"
          value={formData.altura || ""}
          onChange={(e) => setFormData({ ...formData, altura: e.target.value })}
          required
        />
        <Input
          label="Piso"
          value={formData.piso || ""}
          onChange={(e) => setFormData({ ...formData, piso: e.target.value })}
        />
        <Input
          label="Dpto"
          value={formData.dpto || ""}
          onChange={(e) => setFormData({ ...formData, dpto: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Ciudad *"
          value={formData.ciudad || ""}
          onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
          required
        />
        <Select
          label="Provincia *"
          options={provinciaOptions}
          value={formData.provincia || ""}
          onChange={(value) => setFormData({ ...formData, provincia: String(value) })}
        />
      </div>
      <Input
        label="Código Postal *"
        type="number"
        value={formData.cod_postal || ""}
        onChange={(e) => setFormData({ ...formData, cod_postal: parseInt(e.target.value) || null })}
        required
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={checkboxId}
          checked={formData.es_principal || false}
          onChange={(e) => {
            setFormData({ ...formData, es_principal: e.target.checked });
          }}
          className="w-4 h-4 text-principal rounded"
        />
        <label 
          htmlFor={checkboxId} 
          className={`text-sm ${(isPrincipal || formData.es_principal) ? 'text-principal font-medium' : 'text-foreground/70'}`}
        >
          {(isPrincipal || formData.es_principal) ? (
            <span className="flex items-center gap-2">
              <span>✓ Esta es tu dirección principal (desmarcar para quitar)</span>
            </span>
          ) : (
            'Marcar como dirección principal'
          )}
        </label>
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting || !hasChanges}
        >
          <Check className="w-4 h-4 mr-2" />
          {submitLabel}
        </Button>
        <Button
          type="button"
          variant="outline-primary"
          size="sm"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-2" />
          {cancelLabel}
        </Button>
      </div>
    </form>
  );
}

