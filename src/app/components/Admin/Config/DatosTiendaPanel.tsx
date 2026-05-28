"use client";

import { useEffect, useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { ConfigCard } from "./ConfigCard";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import type { IConfigTienda } from "@/app/types/config-tienda.type";

interface DatosTiendaPanelProps {
  config: IConfigTienda | undefined;
  isLoading: boolean;
  mutation: UseMutationResult<
    { success: boolean; data: IConfigTienda },
    Error,
    Partial<IConfigTienda>
  >;
}

export function DatosTiendaPanel({ config, isLoading, mutation }: DatosTiendaPanelProps) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    setNombre(config?.nombre ?? "");
    setDireccion(config?.direccion ?? "");
    setTelefono(config?.telefono ?? "");
  }, [config?.nombre, config?.direccion, config?.telefono]);

  const hasChanges =
    nombre !== (config?.nombre ?? "") ||
    direccion !== (config?.direccion ?? "") ||
    telefono !== (config?.telefono ?? "");

  const handleSave = () => {
    mutation.mutate(
      {
        nombre: nombre.trim() || null,
        direccion: direccion.trim() || null,
        telefono: telefono.trim() || null,
      },
      {
        onSuccess: () => toast.success("Datos del local actualizados"),
        onError: () => toast.error("No se pudieron guardar los datos del local"),
      }
    );
  };

  return (
    <ConfigCard title="Datos del local" status="Activo">
      <p className="text-sm text-text/70 mb-4">
        Se muestran en retiro en tienda (checkout) y en la página de mantenimiento.
      </p>
      <div className="space-y-4">
        <Input
          label="Nombre del local"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="MaxShop"
          disabled={isLoading || mutation.isPending}
        />
        <Input
          label="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Av. Example 1234, Ciudad"
          disabled={isLoading || mutation.isPending}
        />
        <Input
          label="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="+54 9 11 1234-5678"
          disabled={isLoading || mutation.isPending}
        />
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          disabled={!hasChanges || mutation.isPending || isLoading}
          className="w-full sm:w-auto"
        >
          {mutation.isPending ? "Guardando..." : "Guardar datos del local"}
        </Button>
      </div>
    </ConfigCard>
  );
}
