'use client';

import { useDashboardSalesByCategory } from '@/app/hooks/dashboard/useDashboardSalesByCategory';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const COLORS = ['#e88a42', '#2563eb', '#22c55e', '#a855f7', '#ec4899', '#64748b'];

export function SalesCategoryChart() {
    const { data, isLoading } = useDashboardSalesByCategory();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-12 md:col-span-6 lg:col-span-3 bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/5"
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold text-secundario dark:text-white">Por Categoría</h3>
                <p className="text-sm text-secundario dark:text-white/80 font-medium">Ventas totales</p>
            </div>

            <div className="h-[250px] w-full relative">
                {isLoading ? (
                    <Skeleton circle height={200} width={200} className="mx-auto block" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data as any}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="total_vendido"
                                nameKey="categoria"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => {
                                    if (typeof value === 'number') {
                                        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);
                                    }
                                    return value;
                                }}
                                contentStyle={{
                                    backgroundColor: 'var(--terciario)',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#fff',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend
                                layout="horizontal"
                                verticalAlign="bottom"
                                align="center"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
