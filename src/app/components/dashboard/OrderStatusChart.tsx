'use client';

import { useDashboardOrderStatus } from '@/app/hooks/dashboard/useDashboardOrderStatus';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// Mapa de colores por estado (en español, como vienen del backend)
const COLORS: Record<string, string> = {
    'aprobado': '#10b981',   // Verde esmeralda - Success (más diferenciado)
    'pendiente': '#f59e0b',  // Ámbar - Warning (más diferenciado)
    'rechazado': '#ef4444',   // Rojo - Error
    'cancelado': '#6b7280',   // Gris - Cancelado
};

const DEFAULT_COLOR = '#94a3b8';

export function OrderStatusChart() {
    const { data, isLoading, isError } = useDashboardOrderStatus();

    // Transformar datos para asegurar colores consistentes
    const chartData = data.map(item => ({
        ...item,
        color: COLORS[item.estado_pago] || DEFAULT_COLOR
    }));

    if (isError) {
        return (
            <div className="col-span-12 lg:col-span-4 bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-red-200 dark:border-red-900/30 flex items-center justify-center min-h-[400px]">
                <p className="text-red-500">Error al cargar estados</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="col-span-12 lg:col-span-4 bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/5"
        >
            <div className="mb-6">
                <h3 className="text-xl font-bold text-secundario dark:text-white">Estado de Órdenes</h3>
                <p className="text-sm text-secundario dark:text-white/80 font-medium">Distribución por estado de pago</p>
            </div>

            <div className="h-[350px] w-full flex items-center justify-center">
                {isLoading ? (
                    <Skeleton circle height={250} width={250} />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="cantidad"
                                nameKey="estado_pago"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'var(--terciario)',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span className="text-secundario dark:text-white capitalize ml-1">{value.replace('_', ' ')}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
