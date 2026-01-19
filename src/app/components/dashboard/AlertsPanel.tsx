'use client';

import { useDashboardAlerts } from '@/app/hooks/dashboard/useDashboardAlerts';
import { AlertTriangle, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useRouter } from 'next/navigation';

export function AlertsPanel() {
    const { data, isLoading } = useDashboardAlerts();
    const router = useRouter();

    const alerts = [
        {
            key: 'productos_stock_bajo',
            label: 'Stock Bajo',
            value: data?.productos_stock_bajo || 0,
            icon: AlertTriangle,
            color: 'text-orange-500',
            bg: 'bg-orange-500/10',
            action: 'Revisar inventario',
            href: '/admin/productos'
        },
        {
            key: 'ventas_pendientes',
            label: 'Pendientes',
            value: data?.ventas_pendientes || 0,
            icon: Clock,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            action: 'Gestionar órdenes',
            href: '/admin/ventas?estado_pago=pendiente'
        },
        {
            key: 'ventas_problemas_pago',
            label: 'Problemas Pago',
            value: data?.ventas_problemas_pago || 0,
            icon: CreditCard,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            action: 'Ver detalles',
            href: '/admin/ventas'
        }
    ];

    const handleClick = (href: string) => {
        router.push(href);
    };

    return (
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {isLoading
                ? Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-terciario p-4 rounded-xl shadow-sm border border-principal/10 dark:border-white/5">
                        <Skeleton height={20} width={100} className="mb-2" />
                        <Skeleton height={30} width={40} />
                    </div>
                ))
                : alerts.map((alert, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                        onClick={() => handleClick(alert.href)}
                        className="bg-white dark:bg-terciario p-4 flex flex-col justify-between rounded-xl shadow-sm border border-principal/10 dark:border-white/5 hover:border-principal/30 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg ${alert.bg} ${alert.color}`}>
                                <alert.icon size={20} />
                            </div>
                            {alert.value > 0 && (
                                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${alert.bg} ${alert.color}`}>
                                    {alert.value}
                                </span>
                            )}
                        </div>

                        <div>
                            <p className={`text-sm font-semibold ${alert.color} mb-1`}>{alert.label}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className={`text-2xl font-bold ${alert.color}`}>
                                    {alert.value}
                                </span>
                                <span className="text-xs text-principal opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                    {alert.action} <ChevronRight size={14} className="ml-1" />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))
            }
        </div>
    );
}
