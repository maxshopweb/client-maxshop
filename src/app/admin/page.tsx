export default function AdminPage() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                {[
                    { label: "Total Productos", value: "1,234", color: "principal" },
                    { label: "Clientes", value: "856", color: "secundario" },
                    { label: "Eventos Activos", value: "12", color: "principal" },
                    { label: "Ventas Hoy", value: "$45,678", color: "secundario" },
                ].map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white dark:bg-secundario p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-principal/10 dark:border-white/10"
                    >
                        <p className="text-sm text-secundario/60 dark:text-white/60 mb-2">
                            {stat.label}
                        </p>
                        <p className={`text-3xl font-bold text-${stat.color} dark:text-white`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-secundario p-6 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <h2 className="text-xl font-bold text-secundario dark:text-white mb-4">
                    Actividad Reciente
                </h2>
                <div className="space-y-3">
                    {/* Lista de actividades */}
                </div>
            </div>
        </div>
    );
}