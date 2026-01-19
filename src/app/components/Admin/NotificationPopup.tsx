"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import { useNotificationsStore } from "@/app/stores/notificationsStore";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const notifications = useNotificationsStore((state) => state.notifications);
    const unreadCount = useNotificationsStore((state) => state.unreadCount());
    const markAsRead = useNotificationsStore((state) => state.markAsRead);
    const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
    const router = useRouter();

    const handleNotificationClick = (id_venta: number) => {
        markAsRead(id_venta);
        setIsOpen(false);
        router.push(`/admin/ventas?highlight=${id_venta}`);
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead();
    };

    const formatRelativeTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const relative = formatDistanceToNow(date, {
                addSuffix: true,
            });
            // Simple translation for common Spanish phrases
            return relative
                .replace("about ", "")
                .replace("less than a minute ago", "hace un momento")
                .replace("minute ago", "minuto")
                .replace("minutes ago", "minutos")
                .replace("hour ago", "hora")
                .replace("hours ago", "horas")
                .replace("day ago", "día")
                .replace("days ago", "días")
                .replace("ago", "atrás");
        } catch {
            return "hace un momento";
        }
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case "aprobado":
                return "text-green-600 dark:text-green-400";
            case "pendiente":
                return "text-yellow-600 dark:text-yellow-400";
            case "cancelado":
                return "text-red-600 dark:text-red-400";
            default:
                return "text-gray-600 dark:text-gray-400";
        }
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button
                    className="relative p-2 rounded-lg hover:bg-principal/10 dark:hover:bg-white/10 transition-colors duration-200"
                    aria-label="Notificaciones"
                >
                    <Bell
                        className="h-5 w-5"
                        style={{ color: "var(--foreground)" }}
                    />
                    {unreadCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-xs font-bold text-white bg-red-500 rounded-full"
                        >
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </motion.span>
                    )}
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    className="w-[90vw] max-w-md bg-card rounded-lg shadow-xl border border-card z-50"
                    align="end"
                    sideOffset={8}
                    side="bottom"
                    alignOffset={-8}
                    collisionPadding={16}
                >
                    <div className="max-h-[70vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-principal/10 dark:border-white/10">
                            <h3 className="text-sm font-semibold text-text">
                                Notificaciones
                                {unreadCount > 0 && (
                                    <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400">
                                        ({unreadCount} sin leer)
                                    </span>
                                )}
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-principal hover:underline"
                                >
                                    Marcar todas como leídas
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="overflow-y-auto flex-1">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell
                                        className="h-12 w-12 mx-auto mb-3 opacity-20"
                                        style={{ color: "var(--foreground)" }}
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        No hay notificaciones
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-principal/10 dark:divide-white/10">
                                    <AnimatePresence>
                                        {notifications.map((notification) => (
                                            <motion.div
                                                key={notification.id_venta}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className={`
                                                    p-4 cursor-pointer transition-colors duration-150
                                                    ${
                                                        !notification.isRead
                                                            ? "bg-principal/5 dark:bg-white/5 hover:bg-principal/10 dark:hover:bg-white/10"
                                                            : "hover:bg-principal/5 dark:hover:bg-white/5"
                                                    }
                                                `}
                                                onClick={() =>
                                                    handleNotificationClick(
                                                        notification.id_venta
                                                    )
                                                }
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-sm font-semibold text-text">
                                                                Nueva venta
                                                            </h4>
                                                            {!notification.isRead && (
                                                                <span className="w-2 h-2 bg-principal rounded-full flex-shrink-0"></span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                            Venta #{notification.id_venta}
                                                        </p>
                                                        {notification.cliente && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                Cliente: {notification.cliente}
                                                            </p>
                                                        )}
                                                        {notification.producto && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                                {notification.producto}
                                                            </p>
                                                        )}
                                                        {notification.total !== undefined && (
                                                            <p className="text-xs font-medium text-text mb-1">
                                                                Total:{" "}
                                                                {new Intl.NumberFormat("es-AR", {
                                                                    style: "currency",
                                                                    currency: "ARS",
                                                                }).format(notification.total)}
                                                            </p>
                                                        )}
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span
                                                                className={`text-xs font-medium ${getEstadoColor(
                                                                    notification.estado_pago
                                                                )}`}
                                                            >
                                                                {
                                                                    notification.estado_pago.charAt(0).toUpperCase() +
                                                                    notification.estado_pago.slice(1)
                                                                }
                                                            </span>
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                                •
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatRelativeTime(
                                                                    notification.created_at
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

