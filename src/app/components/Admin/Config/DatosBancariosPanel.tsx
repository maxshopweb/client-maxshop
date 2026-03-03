"use client";

import { ConfigSection } from "./ConfigSection";
import { ConfigCard } from "./ConfigCard";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { useDatosBancariosConfig } from "@/app/hooks/config/useDatosBancariosConfig";
import type { UseMutationResult } from "@tanstack/react-query";
import type { IConfigTienda } from "@/app/types/config-tienda.type";

interface DatosBancariosPanelProps {
  config: IConfigTienda | undefined;
  isLoading: boolean;
  mutation: UseMutationResult<{ data: IConfigTienda }, Error, Partial<IConfigTienda>>;
}

function Field({
  label,
  value,
  onChange,
  disabled,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <Input
      label={label}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
    />
  );
}

export function DatosBancariosPanel({ config, isLoading, mutation }: DatosBancariosPanelProps) {
  const { form, update, hasChanges, handleSave } = useDatosBancariosConfig(config, mutation);

  return (
    <ConfigSection title="Datos para transferencia / efectivo">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfigCard title="Cuenta bancaria" status="Activo">
          <div className="space-y-4 pt-2">
            <Field
              label="Banco"
              value={form.banco}
              onChange={(v) => update("banco", v)}
              disabled={isLoading}
              placeholder="Ej. Banco Nación"
              maxLength={100}
            />
            <Field
              label="Tipo de cuenta"
              value={form.tipo_cuenta}
              onChange={(v) => update("tipo_cuenta", v)}
              disabled={isLoading}
              placeholder="Ej. Cuenta Corriente"
              maxLength={50}
            />
            <Field
              label="Número de cuenta"
              value={form.numero_cuenta}
              onChange={(v) => update("numero_cuenta", v)}
              disabled={isLoading}
              placeholder="Ej. 1234567890"
              maxLength={50}
            />
            <Field
              label="CBU"
              value={form.cbu ?? ""}
              onChange={(v) => update("cbu", v)}
              disabled={isLoading}
              placeholder="22 dígitos"
              maxLength={22}
            />
            <Field
              label="Alias"
              value={form.alias ?? ""}
              onChange={(v) => update("alias", v)}
              disabled={isLoading}
              placeholder="Ej. MI.ALIAS.CBU"
              maxLength={50}
            />
          </div>
        </ConfigCard>

        <ConfigCard title="Titular e instrucciones" status="Activo">
          <div className="space-y-4 pt-2">
            <Field
              label="Titular"
              value={form.titular}
              onChange={(v) => update("titular", v)}
              disabled={isLoading}
              placeholder="Razón social o nombre"
              maxLength={255}
            />
            <Field
              label="CUIT"
              value={form.cuit ?? ""}
              onChange={(v) => update("cuit", v)}
              disabled={isLoading}
              placeholder="Ej. 20-12345678-9"
              maxLength={50}
            />
            <Input
              label="Instrucciones"
              type="text"
              value={form.instrucciones ?? ""}
              onChange={(e) => update("instrucciones", e.target.value)}
              placeholder="Ej. Incluir número de pedido en el concepto"
              disabled={isLoading}
              maxLength={500}
            />
            <div className="flex justify-end pt-2">
              <Button
                onClick={handleSave}
                disabled={mutation.isPending || isLoading || !hasChanges}
                variant="primary"
              >
                {mutation.isPending ? "Guardando..." : "Guardar datos bancarios"}
              </Button>
            </div>
          </div>
        </ConfigCard>
      </div>
    </ConfigSection>
  );
}
