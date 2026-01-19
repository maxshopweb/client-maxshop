import { CalendarIcon } from 'lucide-react';

export function DashboardHeader() {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-secundario dark:text-white mb-2">
                    Dashboard
                </h1>
                <p className="text-secundario dark:text-white/80 text-base font-medium">
                    Resumen de actividad y rendimiento
                </p>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-terciario p-2 rounded-xl shadow-sm border border-principal/10 dark:border-white/10">
                <div className="p-2 bg-principal/10 rounded-lg text-principal">
                    <CalendarIcon size={20} />
                </div>
                <div className="px-2">
                    <span className="text-sm font-medium text-secundario dark:text-white">Últimos 30 días</span>
                    {/* Placeholder visual para el selector de fecha */}
                </div>
            </div>
        </div>
    );
}
