'use client';

import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { KpiGrid } from '../components/dashboard/KpiGrid';
import { SalesChart } from '../components/dashboard/SalesChart';
import { OrderStatusChart } from '../components/dashboard/OrderStatusChart';
import { TopProductsChart } from '../components/dashboard/TopProductsChart';
import { SalesCategoryChart } from '../components/dashboard/SalesCategoryChart';
import { CustomersChart } from '../components/dashboard/CustomersChart';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { useNotificationsStore } from '@/app/stores/notificationsStore';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { dashboardKeys } from '../hooks/dashboard/dashboardKeys';
import { toast } from 'sonner';

export default function AdminPage() {
    // Manejo de eventos en tiempo real
    const { lastSaleEvent } = useNotificationsStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        if (lastSaleEvent) {
            // Invalidar queries relevantes cuando llega una nueva venta
            queryClient.invalidateQueries({ queryKey: dashboardKeys.kpis({}) });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.salesOverTime({}) });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.orderStatus({}) });
            queryClient.invalidateQueries({ queryKey: dashboardKeys.alerts() });

            toast.success(`Nueva venta recibida!`, {
                description: `Orden #${lastSaleEvent.id_venta}`
            });
        }
    }, [lastSaleEvent, queryClient]);

    return (
        <div className="space-y-6 pb-10">
            <DashboardHeader />

            <KpiGrid />

            <div className="grid grid-cols-12 gap-6">
                <SalesChart />
                <OrderStatusChart />
            </div>

            <div className="grid grid-cols-12 gap-6">
                <TopProductsChart />
                <SalesCategoryChart />
                <CustomersChart />
            </div>

            <div className="pt-4">
                <h3 className="text-xl font-bold text-secundario dark:text-white mb-4">
                    Alertas Operativas
                </h3>
                <AlertsPanel />
            </div>
        </div>
    );
}
