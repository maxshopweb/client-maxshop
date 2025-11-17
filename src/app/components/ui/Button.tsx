"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "success" | "cancel" | "outline-primary" | "outline-secondary" | "outline-success" | "outline-cancel" | "ghost" | "white-primary";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    children: React.ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    fullWidth = false,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {

    const sizeStyles = {
        sm: "px-3 py-1.5 text-sm rounded-lg",
        md: "px-4 py-2 text-sm rounded-full",
        lg: "px-5 py-2.5 text-base rounded-full"
    };

    const baseStyles = `${sizeStyles[size]} font-medium transition-all duration-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group ${fullWidth ? 'w-full' : 'min-w-[150px]'}`;

    const ghostStyles = "px-2 py-1 text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed min-w-0";

    const variants = {
        primary: "bg-principal text-white hover:bg-principal/90 hover:shadow-xl hover:shadow-principal/40 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",

        secondary: "bg-secundario text-white hover:bg-secundario/90 hover:shadow-xl hover:shadow-secundario/40 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700 dark:bg-white/90 dark:text-secundario dark:hover:bg-white dark:hover:shadow-white/20",

        success: "bg-principal text-white hover:bg-principal/80 hover:shadow-xl hover:shadow-principal/50 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",

        cancel: "bg-terciario text-white hover:bg-terciario/90 hover:shadow-lg hover:shadow-terciario/30 hover:scale-105 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:shadow-white/10",

        "outline-primary": "border-2 border-principal !text-principal bg-transparent hover:!bg-principal hover:!text-white hover:shadow-lg hover:shadow-principal/30 hover:scale-105",

        "outline-secondary": "border-2 border-secundario !text-secundario bg-transparent hover:!bg-secundario hover:!text-white hover:shadow-lg hover:shadow-secundario/30 hover:scale-105 dark:border-white dark:!text-white dark:hover:!bg-white dark:hover:!text-secundario",

        "outline-success": "border-2 border-principal !text-principal bg-transparent hover:!bg-principal hover:!text-white hover:shadow-lg hover:shadow-principal/30 hover:scale-105",

        "outline-cancel": "border-2 border-principal text-principal bg-transparent hover:bg-principal hover:text-white hover:shadow-lg hover:shadow-principal/30 hover:scale-105 dark:border-white dark:text-white dark:hover:text-secundario",

        "white-primary": "bg-white !text-principal border-2 border-principal/20 hover:border-principal hover:bg-principal hover:!text-white hover:shadow-lg hover:shadow-principal/30 hover:scale-105",

        ghost: "text-principal hover:text-principal/80 hover:bg-principal/10 rounded-md"
    };

    const isGhost = variant === "ghost";

    return (
        <button
            className={`${isGhost ? ghostStyles : baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </button>
    );
}