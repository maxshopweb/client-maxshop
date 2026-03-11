'use client';

import { useMemo } from 'react';
import { useDashboardSalesByCategory } from '@/app/hooks/dashboard/useDashboardSalesByCategory';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import type { ISalesByCategoryItem } from '@/app/types/dashboard.type';

const COLORS = ['#e88a42', '#2563eb', '#22c55e', '#a855f7', '#ec4899', '#64748b'];
const MAX_CATEGORIES = 5;

function buildChartData(data: ISalesByCategoryItem[]) {
    if (!data.length) return [];
    const sorted = [...data].sort((a, b) => b.total_vendido - a.total_vendido);
    const top = sorted.slice(0, MAX_CATEGORIES);
    const rest = sorted.slice(MAX_CATEGORIES);
    if (rest.length === 0) return top;
    const otrosTotal = rest.reduce((sum, item) => sum + item.total_vendido, 0);
    return [...top, { categoria: 'Otros', total_vendido: otrosTotal }];
}

export function SalesCategoryChart() {
    const { data, isLoading } = useDashboardSalesByCategory();
    const chartData = useMemo(() => buildChartData(data), [data]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="col-span-12 md:col-span-6 lg:col-span-3 bg-white dark:bg-terciario p-4 rounded-2xl shadow-lg border border-principal/10 dark:border-white/5"
        >
            <div className="mb-2">
                <h3 className="text-lg font-bold text-secundario dark:text-white leading-tight">Por categoría</h3>
                <p className="text-sm text-secundario dark:text-white/80 font-medium leading-tight">Ventas totales</p>
            </div>

            <div className="h-[320px] min-h-[320px] w-full relative">
                {isLoading ? (
                    <Skeleton circle height={200} width={200} className="mx-auto block" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 48, right: 16, left: 16, bottom: 56 }}>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={52}
                                outerRadius={72}
                                paddingAngle={5}
                                dataKey="total_vendido"
                                nameKey="categoria"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${entry.categoria}-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
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
                                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
