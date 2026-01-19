"use client";

import Sidebar from "@/app/components/Admin/SideBar";
import { AuthGuard } from "@/app/components/auth/AuthGuard";
import AccesDenied from "@/app/components/auth/AccesDenied";
import { useWebSocket } from "@/app/hooks/useWebSocket";
import { AdminHeader } from "@/app/components/Admin/AdminHeader";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Inicializar WebSocket para admins
    useWebSocket();

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
                <div className="flex items-center justify-center min-h-screen bg-white">
                    <AccesDenied />
                </div>
            }
        >
            <div className="flex h-screen overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto">
                    <div className="h-full">
                        {/* Header con notificaciones */}
                        <AdminHeader />

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
