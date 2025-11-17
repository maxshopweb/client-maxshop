"use client";

import Sidebar from "@/app/components/Admin/SideBar";


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />

            <main className="flex-1 overflow-y-auto">
                <div className="h-full">
                    {/* Header opcional */}
                    <header className="sticky top-0 z-40 dark:bg-secundario/80 backdrop-blur-md border-b border-principal/10 dark:border-white/10">
                        <div className="px-14 py-5">
                            <h1 className="text-xl font-ligth text-text">
                                Panel de Administración
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
    );
}