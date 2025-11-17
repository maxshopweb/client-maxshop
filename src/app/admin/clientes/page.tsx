export default function ClientesPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-secundario p-8 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <h1 className="text-3xl font-bold text-text mb-4">
                    Gestión de Clientes
                </h1>
                <p className="text-text/60">
                    Módulo en desarrollo - Aquí podrás gestionar clientes, historial de compras y perfiles de usuario.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-2">Total Clientes</h3>
                    <p className="text-3xl font-bold text-principal">0</p>
                </div>
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-2">Clientes Activos</h3>
                    <p className="text-3xl font-bold text-principal">0</p>
                </div>
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-2">Nuevos Este Mes</h3>
                    <p className="text-3xl font-bold text-principal">0</p>
                </div>
            </div>
        </div>
    );
}

