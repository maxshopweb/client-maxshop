"use client";

import Sidebar from "@/app/components/Admin/SideBar";
import { AuthGuard } from "@/app/components/auth/AuthGuard";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard
            roles={['ADMIN']}
            redirectTo="/login"
            redirectUnauthorizedTo="/unauthorized"
            loadingFallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
                    </div>
                </div>
            }
            unauthorizedFallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Acceso denegado
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            No tienes permisos para acceder a esta sección.
                        </p>
                    </div>
                </div>
            }
        >
            <div className="flex h-screen overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="h-full">
                        {/* Header opcional */}
                        <header className="sticky top-0 z-40 dark:bg-secundario/80 backdrop-blur-md border-b border-principal/10 dark:border-white/10">
                            <div className="px-14 py-5">
                                <h1 className="text-xl font-ligth text-text">
                                    Panel de administración
                                </h1>
                            </div>
                        </header>

                        {/* Contenido */}
                        <div className="p-6">
                            <div className="w-full mx-auto">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}