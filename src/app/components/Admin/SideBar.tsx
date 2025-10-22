"use client";

import { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Package,
    Calendar,
    Users,
    Settings,
    Moon,
    Sun
} from "lucide-react";
import { useTheme } from "@/app/context/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Logo from "../ui/Logo";

interface NavItem {
    icon: React.ElementType;
    label: string;
    path: string;
}

const navItems: NavItem[] = [
    { icon: Home, label: "Inicio", path: "/admin" },
    { icon: Package, label: "Productos", path: "/admin/productos" },
    { icon: Calendar, label: "Eventos", path: "/admin/eventos" },
    { icon: Users, label: "Clientes", path: "/admin/clientes" },
    { icon: Settings, label: "Config", path: "/admin/config" },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { theme, setTheme, actualTheme } = useTheme();
    const pathname = usePathname();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <aside
            className={`
                ${isCollapsed ? 'w-20' : 'w-64'} 
                h-screen 
                transition-all duration-300 ease-in-out
                flex flex-col
                relative
                shadow-lg
            `}
            style={{
                backgroundColor: 'var(--background)',
                borderRight: '1px solid rgba(var(--foreground-rgb), 0.1)'
            }}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="
                    absolute -right-3 top-8 z-50
                    w-6 h-6 rounded-full
                    hover:scale-110
                    transition-all duration-300
                    flex items-center justify-center
                    shadow-lg
                "
                style={{
                    backgroundColor: 'var(--principal)',
                    color: 'white'
                }}
            >
                {isCollapsed ? (
                    <ChevronRight size={16} />
                ) : (
                    <ChevronLeft size={16} />
                )}
            </button>

            {/* Logo Section */}
            <div
                className="p-6 flex items-center justify-center"
                style={{
                    borderBottom: '1px solid rgba(var(--foreground-rgb), 0.1)'
                }}
            >
                <div className={`
                    flex items-center gap-3 w-full
                    ${isCollapsed ? 'justify-start' : 'justify-start'}
                `}>
                    <div
                        className="w-18 flex items-center justify-center"
                    >
                        <Logo width={32} height={32} className="w-full h-full object-contain" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex items-start flex-col ">
                            <p className="text-sm">
                                Cristhian
                            </p>
                            <h3
                                className="text-xl font-bold"
                                style={{
                                    color: 'var(--foreground)'
                                }}
                            >
                                Requena
                            </h3>   
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`
                                flex items-center gap-3 px-3 py-3 rounded-xl
                                transition-all duration-300
                                group relative overflow-hidden
                                ${isCollapsed ? 'justify-center' : ''}
                                hover:scale-105
                                before:absolute before:inset-0 
                                before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent 
                                before:translate-x-[-200%] hover:before:translate-x-[200%] 
                                before:transition-transform before:duration-700
                            `}
                            style={{
                                backgroundColor: isActive
                                    ? 'var(--principal)'
                                    : 'transparent',
                                color: isActive
                                    ? 'white'
                                    : 'var(--foreground)',
                                boxShadow: isActive
                                    ? '0 10px 25px rgba(var(--principal-rgb), 0.4)'
                                    : 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(var(--foreground-rgb), 0.05)';
                                    e.currentTarget.style.color = 'var(--principal)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--foreground)';
                                }
                            }}
                        >
                            <Icon size={20} className="relative z-10 flex-shrink-0" />
                            {!isCollapsed && (
                                <span className="relative z-10 font-medium text-sm">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Theme Toggle & Version */}
            <div
                className="p-4 space-y-3"
                style={{
                    borderTop: '1px solid rgba(var(--foreground-rgb), 0.1)'
                }}
            >
                {/* Theme Switch */}
                <button
                    onClick={toggleTheme}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                        transition-all duration-300
                        group relative overflow-hidden
                        ${isCollapsed ? 'justify-center' : ''}
                    `}
                    style={{
                        background: 'linear-gradient(to right, rgba(var(--foreground-rgb), 0.08), rgba(var(--foreground-rgb), 0.03))',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, rgba(var(--foreground-rgb), 0.15), rgba(var(--foreground-rgb), 0.08))';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'linear-gradient(to right, rgba(var(--foreground-rgb), 0.08), rgba(var(--foreground-rgb), 0.03))';
                    }}
                >
                    <div className="relative z-10 flex items-center gap-3 w-full">
                        {actualTheme === 'dark' ? (
                            <Moon
                                size={18}
                                style={{ color: 'var(--foreground)' }}
                            />
                        ) : (
                            <Sun
                                size={18}
                                style={{ color: 'var(--principal)' }}
                            />
                        )}
                        {!isCollapsed && (
                            <span
                                className="text-sm font-medium flex-1 text-left"
                                style={{
                                    color: 'var(--foreground)'
                                }}
                            >
                                {actualTheme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                            </span>
                        )}
                    </div>
                    <div
                        className={`
                            absolute right-3 w-10 h-5 rounded-full
                            transition-all duration-300
                            ${isCollapsed ? 'hidden' : ''}
                        `}
                        style={{
                            backgroundColor: 'rgba(var(--foreground-rgb), 0.15)'
                        }}
                    >
                        <div
                            className="w-4 h-4 rounded-full transition-transform duration-300 mt-0.5"
                            style={{
                                backgroundColor: 'var(--principal)',
                                transform: actualTheme === 'dark' ? 'translateX(20px)' : 'translateX(2px)'
                            }}
                        />
                    </div>
                </button>

                {/* Version Info */}
                {!isCollapsed && (
                    <div className="text-center pt-2">
                        <p
                            className="text-xs font-medium"
                            style={{
                                color: 'rgba(var(--foreground-rgb), 0.5)'
                            }}
                        >
                            MaxShop Admin
                        </p>
                        <p
                            className="text-xs font-semibold"
                            style={{
                                color: 'var(--principal)'
                            }}
                        >
                            v1.0.0 Beta
                        </p>
                    </div>
                )}
                {isCollapsed && (
                    <div className="text-center">
                        <p
                            className="text-[10px] font-bold"
                            style={{
                                color: 'var(--principal)'
                            }}
                        >
                            v1.0
                        </p>
                    </div>
                )}
            </div>
        </aside>
    );
}