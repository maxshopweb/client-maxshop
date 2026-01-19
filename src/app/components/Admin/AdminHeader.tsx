"use client";

import { Bell } from "lucide-react";
import { NotificationPopup } from "./NotificationPopup";
import { useNotificationsStore } from "@/app/stores/notificationsStore";

export function AdminHeader() {
    const unreadCount = useNotificationsStore((state) => state.unreadCount());

    return (
        <header className="sticky top-0 z-40 dark:bg-secundario/80 backdrop-blur-md border-b border-principal/10 dark:border-white/10">
            <div className="px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-light text-text">
                    Panel de administración
                </h1>

                <div className="flex items-center gap-4">
                    <NotificationPopup />
                </div>
            </div>
        </header>
    );
}


