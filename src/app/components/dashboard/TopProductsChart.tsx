'use client';

import { useDashboardTopProducts } from '@/app/hooks/dashboard/useDashboardTopProducts';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white dark:bg-terciario p-4 rounded-xl shadow-xl border border-principal/10 dark:border-white/10 z-50">
                <p className="text-secundario dark:text-white font-bold mb-1 truncate max-w-[200px]">
                    {data.nombre}
                </p>
                <div className="space-y-1 text-sm">
                    <p className="text-principal">
                        Sold: <span className="font-bold">{data.cantidad_vendida}</span>
                    </p>
                    <p className="text-secundario/60 dark:text-white/60">
                        Total: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(data.total_facturado)}
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function TopProductsChart() {
    const { data, isLoading } = useDashboardTopProducts({ params: { limit: 5 } });

    // Ordener ascendente para que aparezca el top 1 arriba en el gráfico de barras horizontal (recharts renderiza de abajo hacia arriba en eje Y por defecto si no se configura diferente, o visualmente depende)
    // Normalmente top products viene desc, para vertical list, pero para bar chart horizontal a veces queremos el mayor arriba.
    // Recharts Y-axis 'category' type stacks from bottom to top by default of the array order.
    // We want the most sold at the top? usually chart Y axis goes bottom up.
    // Let's reverse data for better visual in horizontal bar chart if needed.
    // Assuming API returns sorted DESC by sales.
    const chartData = [...data].reverse();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-12 lg:col-span-6 bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/5"
        >
            <div className="mb-2">
                <h3 className="text-xl font-bold text-secundario dark:text-white">Top Productos</h3>
                <p className="text-sm text-secundario dark:text-white/80 font-medium">Los 5 más vendidos</p>
            </div>

            <div className="h-[300px] w-full">
                {isLoading ? (
                    <Skeleton count={5} height={40} className="mb-4" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="nombre"
                                width={100}
                                tick={{ fill: 'var(--text)', fontSize: 12 }}
                                tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                            />
                            <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
                            <Bar dataKey="cantidad_vendida" radius={[0, 4, 4, 0]} barSize={20}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="var(--principal)" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
