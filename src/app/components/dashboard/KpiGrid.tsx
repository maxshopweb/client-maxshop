'use client';

import { useDashboardKpis } from '@/app/hooks/dashboard/useDashboardKpis';
import { DollarSign, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-AR').format(value);
};

export function KpiGrid() {
    const { data, isLoading, isError } = useDashboardKpis();

    const cards = [
        {
            label: 'Ventas Netas',
            value: data ? formatCurrency(data.total_ventas_netas) : '$0',
            icon: DollarSign,
            color: 'text-principal',
            bgColor: 'bg-principal/10',
            delay: 0,
        },
        {
            label: 'Órdenes',
            value: data ? formatNumber(data.cantidad_ordenes) : '0',
            icon: ShoppingBag,
            color: 'text-blue-500', // Using a distinct color as requested for "wow" factor, kept harmonious
            bgColor: 'bg-blue-500/10',
            delay: 0.1,
        },
        {
            label: 'Ticket Promedio',
            value: data ? formatCurrency(data.ticket_promedio) : '$0',
            icon: TrendingUp,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
            delay: 0.2,
        },
        {
            label: 'Clientes Únicos',
            value: data ? formatNumber(data.clientes_unicos) : '0',
            icon: Users,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
            delay: 0.3,
        },
    ];

    if (isError) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400">
                Error al cargar KPIs
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: card.delay }}
                    className="bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/5 hover:shadow-xl transition-shadow"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.bgColor} ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        {/* Optional: Add percentage growth here if available in future */}
                    </div>

                    <h3 className="text-secundario dark:text-white/90 text-sm font-semibold mb-1">
                        {card.label}
                    </h3>

                    <div className="text-2xl font-bold text-secundario dark:text-white">
                        {isLoading ? <Skeleton width={100} /> : card.value}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
