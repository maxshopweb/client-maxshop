export default function ConfigPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-secundario p-8 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <h1 className="text-3xl font-bold text-text mb-4">
                    Configuración del Sistema
                </h1>
                <p className="text-text/60">
                    Módulo en desarrollo - Aquí podrás configurar ajustes generales del negocio, integraciones y preferencias.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-3">Configuraciones Disponibles</h3>
                    <ul className="space-y-2 text-text/70">
                        <li>• Datos del Negocio</li>
                        <li>• Métodos de Pago</li>
                        <li>• Configuración de Envíos</li>
                        <li>• Integraciones (Mercado Pago, etc.)</li>
                        <li>• Preferencias del Sistema</li>
                    </ul>
                </div>
                <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                    <h3 className="font-semibold text-text mb-3">Estado del Sistema</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-text/70">Base de Datos</span>
                            <span className="text-green-500 font-semibold">✓ Conectado</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text/70">API Backend</span>
                            <span className="text-green-500 font-semibold">✓ Operativo</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text/70">Versión</span>
                            <span className="text-principal font-semibold">v1.0.0 Beta</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

