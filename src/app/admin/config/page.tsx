"use client";

import { useConfigTienda, useConfigTiendaMutation } from "@/app/hooks/config/useConfigTienda";
import { usePromoConfig } from "@/app/hooks/config/usePromoConfig";
import { Button } from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import { AdminPageHeader } from "@/app/components/Admin/AdminPageHeader";
import { AdminPageContainer } from "@/app/components/Admin/AdminPageContainer";
import { ConfigSection } from "@/app/components/Admin/Config/ConfigSection";
import { ConfigCard } from "@/app/components/Admin/Config/ConfigCard";
import { IntegrationCard } from "@/app/components/Admin/Config/IntegrationCard";
import { BannersPanel } from "@/app/components/Admin/Config/Banners/BannersPanel";
import { DatosBancariosPanel } from "@/app/components/Admin/Config/DatosBancariosPanel";
import { Switch } from "@/app/components/ui/Switch";

const INTEGRATIONS = [
    {
        logoSrc: "/logos/mp-logo.png",
        name: "Mercado Pago",
        description: "Integración de pagos y gestión de transacciones",
        status: "Activa" as const,
        ambiente: "Dev",
    },
    {
        logoSrc: "/logos/andreani-logo.png",
        name: "Andreani",
        description: "Gestión de envíos y logística",
        status: "Activa" as const,
        ambiente: "Dev",
    },
];

function onlyDigits(value: string) {
    return value.replace(/\D/g, "");
}

export default function ConfigPage() {
    const { data: config, isLoading, isError, refetch } = useConfigTienda();
    const mutation = useConfigTiendaMutation();
    const promo = usePromoConfig(config, mutation, isLoading);

    return (
        <AdminPageContainer>
            <AdminPageHeader
                title="Configuración del sistema"
                description="Gestiona las integraciones y reglas de negocio de tu sistema."
            />

            <ConfigSection title="Banners">
                <BannersPanel />
            </ConfigSection>

            <ConfigSection title="Integraciones" columns={2}>
                {INTEGRATIONS.map((integration) => (
                    <IntegrationCard key={integration.name} {...integration} />
                ))}
            </ConfigSection>

            <DatosBancariosPanel config={config} isLoading={isLoading} mutation={mutation} />

            <ConfigSection title="Reglas de negocio" columns={3}>
                {isError && (
                    <div className="col-span-full rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-text">
                        <p className="font-medium">No se pudo cargar la configuración desde el servidor.</p>
                        <p className="mt-1 text-text/80">
                            Podés editar y guardar con los valores por defecto o reintentar la carga.
                        </p>
                        <button
                            type="button"
                            onClick={() => void refetch()}
                            className="mt-2 text-sm font-semibold text-principal underline underline-offset-2 hover:opacity-90"
                        >
                            Reintentar
                        </button>
                    </div>
                )}
                <ConfigCard title="Envíos gratis" status={promo.envioActivo ? "Activo" : "Inactivo"}>
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-text">Regla activa</span>
                        <Switch
                            checked={promo.envioActivo}
                            onCheckedChange={promo.setEnvioActivo}
                            disabled={isLoading || mutation.isPending}
                            aria-label="Activar o desactivar envío gratis"
                        />
                    </div>
                    <Input
                        label="Monto mínimo (pesos):"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={promo.envioMin}
                        onChange={(e) => promo.setEnvioMin(onlyDigits(e.target.value))}
                        placeholder="100000"
                        disabled={isLoading}
                    />
                    {!promo.envioActivo && (
                        <p className="mt-1 text-xs text-text/60">
                            La regla está desactivada: no se aplicará envío gratis por monto.
                        </p>
                    )}
                    <p className="mt-1 text-text/60">Todo el país</p>
                </ConfigCard>

                <ConfigCard title="Cuotas sin interés" status={promo.cuotasActivo ? "Activo" : "Inactivo"}>
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-text">Regla activa</span>
                        <Switch
                            checked={promo.cuotasActivo}
                            onCheckedChange={promo.setCuotasActivo}
                            disabled={isLoading || mutation.isPending}
                            aria-label="Activar o desactivar cuotas sin interés"
                        />
                    </div>
                    <Input
                        label="Cantidad de cuotas:"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={promo.cuotas}
                        onChange={(e) => promo.setCuotas(onlyDigits(e.target.value))}
                        disabled={isLoading}
                    />
                    <Input
                        label="Monto mínimo (pesos):"
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={promo.cuotasMin}
                        onChange={(e) => promo.setCuotasMin(onlyDigits(e.target.value))}
                        placeholder="80000"
                        disabled={isLoading}
                    />
                    {!promo.cuotasActivo && (
                        <p className="mt-1 text-xs text-text/60">
                            La regla está desactivada: no se ofrecerán cuotas promocionales.
                        </p>
                    )}
                </ConfigCard>

                <div className="flex items-end">
                    <Button
                        onClick={promo.handleSave}
                        disabled={mutation.isPending || isLoading || !promo.hasChanges}
                        variant="primary"
                        className="w-full"
                    >
                        {mutation.isPending ? "Guardando..." : "Guardar envío y cuotas"}
                    </Button>
                </div>

                <ConfigCard
                    title="Alerta stock mínimo"
                    status="Activo"
                    fields={[
                        { label: "Umbral", value: "5 unidades", highlight: true },
                        { label: "Notificación", value: "Email automático" },
                    ]}
                />

                <ConfigCard
                    title="Eventos activos"
                    status="Inactivo"
                    fields={[
                        { label: "Tipo", value: "Eventos por fechas" },
                        { label: "Estado", value: "Sin eventos activos" },
                    ]}
                />

                <ConfigCard
                    title="Política de devoluciones"
                    status="Activo"
                    fields={[
                        { label: "Plazo", value: "30 días", highlight: true },
                        { label: "Condición", value: "Producto sin uso" },
                    ]}
                />
            </ConfigSection>
        </AdminPageContainer>
    );
}
