import Image from "next/image";

export default function ConfigPage() {
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-secundario p-8 rounded-2xl shadow-lg border border-principal/10 dark:border-white/10">
                <h1 className="text-3xl font-bold text-text mb-4">
                    Configuración del Sistema
                </h1>
                <p className="text-text/60">
                    Gestiona las integraciones y reglas de negocio de tu sistema.
                </p>
            </div>

            {/* Integraciones */}
            <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                <h2 className="text-2xl font-bold text-text mb-6">
                    Integraciones
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mercado Pago */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-principal/40 dark:hover:border-white/40">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="relative w-16 h-16 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 border border-principal/10 dark:border-white/10">
                                    <Image
                                        src="/logos/mp-logo.png"
                                        alt="Mercado Pago"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-text mb-2">
                                        Mercado Pago
                                    </h3>
                                    <p className="text-text/60 text-sm">
                                        Integración de pagos y gestión de transacciones
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold flex-shrink-0">
                                Activa
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div className="flex justify-between">
                                <span>Estado:</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">Conectado</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ambiente:</span>
                                <span className="text-text font-medium">Dev</span>
                            </div>
                        </div>
                    </div>

                    {/* Andreani */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-principal/40 dark:hover:border-white/40">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                                <div className="relative w-16 h-16 flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg p-2 border border-principal/10 dark:border-white/10">
                                    <Image
                                        src="/logos/andreani-logo.png"
                                        alt="Andreani"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-text mb-2">
                                        Andreani
                                    </h3>
                                    <p className="text-text/60 text-sm">
                                        Gestión de envíos y logística
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold flex-shrink-0">
                                Activa
                            </span>
                        </div>
                        <div className="space-y-2 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div className="flex justify-between">
                                <span>Estado:</span>
                                <span className="text-green-600 dark:text-green-400 font-medium">Conectado</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Ambiente:</span>
                                <span className="text-text font-medium">Dev</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reglas de Negocio */}
            <div className="bg-white dark:bg-secundario p-6 rounded-xl shadow border border-principal/10 dark:border-white/10">
                <h2 className="text-2xl font-bold text-text mb-6">
                    Reglas de Negocio
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Envíos Gratis */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text">
                                Envíos Gratis
                            </h3>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                                Activo
                            </span>
                        </div>
                        <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div>
                                <span className="font-medium text-text">Monto mínimo:</span>
                                <p className="text-principal font-semibold mt-1">$50.000</p>
                            </div>
                            <div>
                                <span className="font-medium text-text">Zonas aplicables:</span>
                                <p className="mt-1">Todo el país</p>
                            </div>
                        </div>
                    </div>

                    {/* Cuotas Sin Interés */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text">
                                Cuotas Sin Interés
                            </h3>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                                Activo
                            </span>
                        </div>
                        <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div>
                                <span className="font-medium text-text">Cuotas disponibles:</span>
                                <p className="text-principal font-semibold mt-1">3, 6, 12 cuotas</p>
                            </div>
                            <div>
                                <span className="font-medium text-text">Monto mínimo:</span>
                                <p className="mt-1">$20.000</p>
                            </div>
                        </div>
                    </div>

                    {/* Descuentos por Volumen */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text">
                                Descuentos por Volumen
                            </h3>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold">
                                Inactivo
                            </span>
                        </div>
                        <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div>
                                <span className="font-medium text-text">Tipo:</span>
                                <p className="mt-1">Descuento por cantidad</p>
                            </div>
                            <div>
                                <span className="font-medium text-text">Aplicación:</span>
                                <p className="mt-1">Por producto</p>
                            </div>
                        </div>
                    </div>

                    {/* Stock Mínimo */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text">
                                Alerta Stock Mínimo
                            </h3>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                                Activo
                            </span>
                        </div>
                        <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div>
                                <span className="font-medium text-text">Umbral:</span>
                                <p className="text-principal font-semibold mt-1">5 unidades</p>
                            </div>
                            <div>
                                <span className="font-medium text-text">Notificación:</span>
                                <p className="mt-1">Email automático</p>
                            </div>
                        </div>
                    </div>

                    {/* Promociones Temporales */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text">
                                Promociones Temporales
                            </h3>
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-semibold">
                                Inactivo
                            </span>
                        </div>
                        <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div>
                                <span className="font-medium text-text">Tipo:</span>
                                <p className="mt-1">Descuentos por fechas</p>
                            </div>
                            <div>
                                <span className="font-medium text-text">Estado:</span>
                                <p className="mt-1">Sin promociones activas</p>
                            </div>
                        </div>
                    </div>

                    {/* Política de Devoluciones */}
                    <div className="bg-white dark:bg-secundario border border-principal/20 dark:border-white/20 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-text">
                                Política de Devoluciones
                            </h3>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-semibold">
                                Activo
                            </span>
                        </div>
                        <div className="space-y-3 text-sm text-text/70 pt-4 border-t border-principal/10 dark:border-white/10">
                            <div>
                                <span className="font-medium text-text">Plazo:</span>
                                <p className="text-principal font-semibold mt-1">30 días</p>
                            </div>
                            <div>
                                <span className="font-medium text-text">Condición:</span>
                                <p className="mt-1">Producto sin uso</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

