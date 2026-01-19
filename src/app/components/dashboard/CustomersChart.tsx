'use client';

import { useDashboardCustomersSummary } from '@/app/hooks/dashboard/useDashboardCustomersSummary';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function CustomersChart() {
    const { data, isLoading } = useDashboardCustomersSummary();

    const chartData = data ? [
        { name: 'Nuevos', value: data.clientes_nuevos, color: '#22c55e' },
        { name: 'Recurrentes', value: data.clientes_recurrentes, color: '#3b82f6' },
    ] : [];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="col-span-12 md:col-span-6 lg:col-span-3 bg-white dark:bg-terciario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/5"
        >
            <div className="mb-4">
                <h3 className="text-lg font-bold text-secundario dark:text-white">Clientes</h3>
                <p className="text-sm text-secundario dark:text-white/80 font-medium">Retención</p>
            </div>

            <div className="h-[250px] w-full">
                {isLoading ? (
                    <Skeleton circle height={200} width={200} className="mx-auto block" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                ))}
                            </Pie>
                            <Tooltip
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
                                verticalAlign="bottom"
                                height={36}
                                iconSize={8}
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
}
