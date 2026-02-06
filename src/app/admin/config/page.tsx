"use client";

import Image from "next/image";
import { useConfigTienda, useConfigTiendaMutation } from "@/app/hooks/config/useConfigTienda";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/Button";

export default function ConfigPage() {
  const { data: config, isLoading: loadingConfig } = useConfigTienda();
  const mutation = useConfigTiendaMutation();

  const [envioMin, setEnvioMin] = useState<string>("");
  const [cuotas, setCuotas] = useState<string>("");
  const [cuotasMin, setCuotasMin] = useState<string>("");

  useEffect(() => {
    if (config) {
      setEnvioMin(String(config.envio_gratis_minimo ?? 100000));
      setCuotas(String(config.cuotas_sin_interes ?? 3));
      setCuotasMin(String(config.cuotas_sin_interes_minimo ?? 80000));
    }
  }, [config]);

  const handleSavePromos = async () => {
    const envio = parseInt(envioMin.replace(/\D/g, ""), 10);
    const nCuotas = parseInt(cuotas, 10);
    const minCuotas = parseInt(cuotasMin.replace(/\D/g, ""), 10);
    if (isNaN(envio) || envio < 0) {
      toast.error("Monto mínimo de envío gratis inválido");
      return;
    }
    if (isNaN(nCuotas) || nCuotas < 1) {
      toast.error("Cantidad de cuotas inválida");
      return;
    }
    if (isNaN(minCuotas) || minCuotas < 0) {
      toast.error("Monto mínimo para cuotas inválido");
      return;
    }
    try {
      await mutation.mutateAsync({
        envio_gratis_minimo: envio,
        cuotas_sin_interes: nCuotas,
        cuotas_sin_interes_minimo: minCuotas,
      });
      toast.success("Configuración guardada. Los mensajes se actualizarán en toda la tienda.");
    } catch {
      toast.error("Error al guardar la configuración");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-secundario p-8 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
        <h1 className="text-3xl font-bold text-text mb-4">
          Configuración del Sistema
        </h1>
        <p className="text-text/60">
          Gestiona las integraciones y reglas de negocio de tu sistema.
        </p>
      </div>

      {/* Integraciones */}
      <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
        <h2 className="text-2xl font-bold text-text mb-6">
          Integraciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mercado Pago */}
          <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-principal/40 dark:hover:border-white/40">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="relative w-16 h-16 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 border border-principal/10 dark:border-white/10">
                  <Image
                    src="/logos/mp-logo.png"
                    alt="Mercado Pago"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text mb-2">
                    Mercado Pago
                  </h3>
                  <p className="text-text/60 text-sm">
                    Integración de pagos y gestión de transacciones
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold flex-shrink-0">
                Activa
              </span>
            </div>
            <div className="space-y-2 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Conectado</span>
              </div>
              <div className="flex justify-between">
                <span>Ambiente:</span>
                <span className="text-text font-medium">Dev</span>
              </div>
            </div>
          </div>

          {/* Andreani */}
          <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-principal/40 dark:hover:border-white/40">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="relative w-16 h-16 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 border border-principal/10 dark:border-white/10">
                  <Image
                    src="/logos/andreani-logo.png"
                    alt="Andreani"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text mb-2">
                    Andreani
                  </h3>
                  <p className="text-text/60 text-sm">
                    Gestión de envíos y logística
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold flex-shrink-0">
                Activa
              </span>
            </div>
            <div className="space-y-2 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Conectado</span>
              </div>
              <div className="flex justify-between">
                <span>Ambiente:</span>
                <span className="text-text font-medium">Dev</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reglas de Negocio */}
      <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
        <h2 className="text-2xl font-bold text-text mb-6">
          Reglas de Negocio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Envíos Gratis - editable */}
          <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                Envíos Gratis
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                Activo
              </span>
            </div>
            <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
              <div>
                <span className="font-medium text-text">Monto mínimo (pesos):</span>
                <input
                  type="text"
                  value={envioMin}
                  onChange={(e) => setEnvioMin(e.target.value)}
                  placeholder="100000"
                  className="mt-1 w-full rounded border border-principal/20 dark:border-white/20 bg-input text-input-text px-3 py-2 text-principal font-semibold"
                  disabled={loadingConfig}
                />
              </div>
              <p className="mt-1 text-text/60">Todo el país</p>
            </div>
          </div>

          {/* Cuotas Sin Interés - editable */}
          <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                Cuotas Sin Interés
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                Activo
              </span>
            </div>
            <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
              <div>
                <span className="font-medium text-text">Cantidad de cuotas:</span>
                <input
                  type="number"
                  min={1}
                  value={cuotas}
                  onChange={(e) => setCuotas(e.target.value)}
                  className="mt-1 w-full rounded border border-principal/20 dark:border-white/20 bg-input text-input-text px-3 py-2 text-principal font-semibold"
                  disabled={loadingConfig}
                />
              </div>
              <div>
                <span className="font-medium text-text">Monto mínimo (pesos):</span>
                <input
                  type="text"
                  value={cuotasMin}
                  onChange={(e) => setCuotasMin(e.target.value)}
                  placeholder="80000"
                  className="mt-1 w-full rounded border border-principal/20 dark:border-white/20 bg-input text-input-text px-3 py-2 text-principal font-semibold"
                  disabled={loadingConfig}
                />
              </div>
            </div>
          </div>

          {/* Botón guardar promos */}
          <div className="flex items-end">
            <Button
              onClick={handleSavePromos}
              disabled={mutation.isPending || loadingConfig}
              variant="primary"
              className="w-full"
            >
              {mutation.isPending ? "Guardando..." : "Guardar envío y cuotas"}
            </Button>
          </div>

          {/* Stock Mínimo */}
          <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                Alerta Stock Mínimo
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                Activo
              </span>
            </div>
            <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
              <div>
                <span className="font-medium text-text">Umbral:</span>
                <p className="text-principal font-semibold mt-1">5 unidades</p>
              </div>
              <div>
                <span className="font-medium text-text">Notificación:</span>
                <p className="mt-1">Email automático</p>
              </div>
            </div>
          </div>

          {/* Eventos activos (antes Promociones temporales) */}
          <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                Eventos activos
              </h3>
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold">
                Inactivo
              </span>
            </div>
            <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
              <div>
                <span className="font-medium text-text">Tipo:</span>
                <p className="mt-1">Eventos por fechas</p>
              </div>
              <div>
                <span className="font-medium text-text">Estado:</span>
                <p className="mt-1">Sin eventos activos</p>
              </div>
            </div>
          </div>

          {/* Política de Devoluciones */}
          <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                Política de Devoluciones
              </h3>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                Activo
              </span>
            </div>
            <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
              <div>
                <span className="font-medium text-text">Plazo:</span>
                <p className="text-principal font-semibold mt-1">30 días</p>
              </div>
              <div>
                <span className="font-medium text-text">Condición:</span>
                <p className="mt-1">Producto sin uso</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
