export default function EventosPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-secundario p-8 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <h1 className="text-3xl font-bold text-text mb-4">
                    Gestión de Eventos
                </h1>
                <p className="text-text/60">
                    Módulo en desarrollo - Aquí podrás gestionar eventos, promociones y descuentos especiales.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-2">Eventos Activos</h3>
                    <p className="text-3xl font-bold text-principal">0</p>
                </div>
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-2">Eventos Programados</h3>
                    <p className="text-3xl font-bold text-principal">0</p>
                </div>
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-2">Eventos Finalizados</h3>
                    <p className="text-3xl font-bold text-principal">0</p>
                </div>
            </div>
        </div>
    );
}

