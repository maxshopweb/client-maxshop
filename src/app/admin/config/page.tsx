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

export default function ConfigPage() {
    const { data: config, isLoading } = useConfigTienda();
    const mutation = useConfigTiendaMutation();
    const promo = usePromoConfig(config, mutation);

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

            <ConfigSection title="Reglas de negocio" columns={3}>
                <ConfigCard title="Envíos gratis" status="Activo">
                    <Input
                        label="Monto mínimo (pesos):"
                        type="text"
                        value={promo.envioMin}
                        onChange={(e) => promo.setEnvioMin(e.target.value)}
                        placeholder="100000"
                        disabled={isLoading}
                    />
                    <p className="mt-1 text-text/60">Todo el país</p>
                </ConfigCard>

                <ConfigCard title="Cuotas sin interés" status="Activo">
                    <Input
                        label="Cantidad de cuotas:"
                        type="number"
                        min={1}
                        value={promo.cuotas}
                        onChange={(e) => promo.setCuotas(e.target.value)}
                        disabled={isLoading}
                    />
                    <Input
                        label="Monto mínimo (pesos):"
                        type="text"
                        value={promo.cuotasMin}
                        onChange={(e) => promo.setCuotasMin(e.target.value)}
                        placeholder="80000"
                        disabled={isLoading}
                    />
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
