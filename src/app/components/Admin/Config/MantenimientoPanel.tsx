"use client";

import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { ConfigCard } from "./ConfigCard";
import { Switch } from "@/app/components/ui/Switch";
import { Button } from "@/app/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog";
import type { IConfigTienda } from "@/app/types/config-tienda.type";

interface MantenimientoPanelProps {
  config: IConfigTienda | undefined;
  isLoading: boolean;
  mutation: UseMutationResult<
    { success: boolean; data: IConfigTienda },
    Error,
    Partial<IConfigTienda>
  >;
}

export function MantenimientoPanel({ config, isLoading, mutation }: MantenimientoPanelProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const active = Boolean(config?.modo_mantenimiento);

  const handleSwitchChange = (checked: boolean) => {
    if (checked) {
      setConfirmOpen(true);
      return;
    }
    mutation.mutate(
      { modo_mantenimiento: false },
      {
        onSuccess: () => toast.success("Modo mantenimiento desactivado. La tienda ya está visible."),
        onError: () => toast.error("No se pudo desactivar el modo mantenimiento."),
      }
    );
  };

  const handleConfirmActivate = () => {
    mutation.mutate(
      { modo_mantenimiento: true },
      {
        onSuccess: () => {
          toast.success("Modo mantenimiento activado.");
          setConfirmOpen(false);
        },
        onError: () => toast.error("No se pudo activar el modo mantenimiento."),
      }
    );
  };

  return (
    <>
      <ConfigCard title="Tienda en mantenimiento" status={active ? "Activo" : "Inactivo"}>
        <div className="flex flex-col gap-4 pt-2">
          <p className="text-sm text-text/80 leading-relaxed">
            Cuando está activo, los clientes solo ven la página de mantenimiento. El panel de administración
            sigue disponible para vos.
          </p>

          {active && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-text">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
              <p>
                <span className="font-semibold">La tienda está en mantenimiento.</span> Los cambios pueden tardar
                hasta unos 30 segundos en aplicarse para todos los visitantes.
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-medium text-text">Activar modo mantenimiento</span>
            <Switch
              checked={active}
              onCheckedChange={handleSwitchChange}
              disabled={isLoading || mutation.isPending}
              aria-label="Activar o desactivar modo mantenimiento"
            />
          </div>
        </div>
      </ConfigCard>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showClose={!mutation.isPending}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              ¿Activar modo mantenimiento?
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <span className="block text-text/90">
                La tienda quedará <strong>invisible para los clientes</strong>: cualquier visita a la tienda los
                llevará a la página de mantenimiento.
              </span>
              <span className="block text-text/90">
                Podés seguir usando el <strong>panel de administración</strong> con normalidad.
              </span>
              <span className="block text-sm text-text/70">
                Para volver atrás, desactivá el modo desde esta misma pantalla.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline-secondary"
              disabled={mutation.isPending}
              onClick={() => setConfirmOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
              disabled={mutation.isPending}
              onClick={handleConfirmActivate}
            >
              {mutation.isPending ? "Activando..." : "Sí, activar mantenimiento"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
