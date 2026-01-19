'use client';

import { useDashboardSalesOverTime } from '@/app/hooks/dashboard/useDashboardSalesOverTime';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-terciario p-4 rounded-xl shadow-xl border border-principal/10 dark:border-white/10">
                <p className="text-secundario dark:text-white font-medium mb-2">
                    {label ? format(parseISO(label), 'd MMM yyyy', { locale: es }) : ''}
                </p>
                <p className="text-principal font-bold text-sm">
                    Ventas: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(payload[0].value)}
                </p>
                <p className="text-secundario/60 dark:text-white/60 text-sm">
                    Órdenes: {payload[0].payload.cantidad_ordenes}
                </p>
            </div>
        );
    }
    return null;
};

export function SalesChart() {
    const { data, isLoading, isError } = useDashboardSalesOverTime();

    if (isError) {
        return (
            <div className="col-span-12 lg:col-span-8 bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-red-200 dark:border-red-900/30 flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">Error al cargar gráfico de ventas</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="col-span-12 lg:col-span-8 bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/5"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-secundario dark:text-white">Ventas en el tiempo</h3>
                <p className="text-sm text-secundario dark:text-white/80 font-medium">Análisis diario de ingresos</p>
            </div>

            <div className="h-[350px] w-full">
                {isLoading ? (
                    <Skeleton height="100%" className='rounded-xl' />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#e88a42" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#e88a42" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--card-border)" />
                            <XAxis
                                dataKey="fecha"
                                tickFormatter={(str) => format(parseISO(str), 'd MMM', { locale: es })}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--text)', fontSize: 12, opacity: 0.6 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(value) => `$${value / 1000}k`}
                                tick={{ fill: 'var(--text)', fontSize: 12, opacity: 0.6 }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="total_vendido"
                                stroke="#e88a42"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorVentas)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
