"use client";

import { ButtonHTMLAttributes, ReactElement } from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type HeroButtonVariant = 
  | "orange-white"      // naranja en blanco
  | "white-orange"      // blanco con naranja
  | "blue-orange"       // azul con naranja
  | "orange-blue"       // naranja con azul
  | "blue-white";        // azul con blanco

interface HeroButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: HeroButtonVariant;
  icon: LucideIcon;
  children: React.ReactNode;
  href?: string;
  className?: string;
}

const variantStyles = {
  "orange-white": {
    button: "bg-principal text-white hover:bg-principal/90",
    iconBg: "bg-white",
    iconColor: "text-principal",
  },
  "white-orange": {
    button: "bg-white text-principal hover:bg-white/90",
    iconBg: "bg-principal",
    iconColor: "text-white",
  },
  "blue-orange": {
    button: "bg-azul text-principal hover:bg-azul/90",
    iconBg: "bg-principal",
    iconColor: "text-white",
  },
  "orange-blue": {
    button: "bg-principal text-azul hover:bg-principal/90",
    iconBg: "bg-azul",
    iconColor: "text-white",
  },
  "blue-white": {
    button: "bg-azul text-white hover:bg-azul/90",
    iconBg: "bg-white",
    iconColor: "text-azul",
  },
};

export default function HeroButton({
  variant = "orange-white",
  icon: Icon,
  children,
  href,
  className = "",
  ...props
}: HeroButtonProps) {
  const styles = variantStyles[variant];

  const buttonContent = (
    <button
      className={`
        group
        relative
        inline-flex
        items-center
        pr-0
        pl-5
        py-3
        md:pl-6
        md:py-3
        rounded-full
        font-semibold
        text-base
        md:text-lg
        transition-all
        duration-300
        hover:shadow-xl
        active:scale-95
        overflow-hidden
        
        ${styles.button}
        ${className}
      `}
      {...props}
    >
      <span className="relative z-10 pr-14 md:pr-15">{children}</span>
      {/* Icono con fondo circular con espacio del borde - mismo radio que el botón */}
      <div className={`
        absolute
        right-1
        top-1
        bottom-1
        flex
        items-center
        justify-center
        aspect-square
        rounded-full
        ${styles.iconBg}
        transition-all
        duration-300
      `}>
        <Icon className={`w-5 h-5 md:w-6 md:h-6 ${styles.iconColor} transition-transform duration-300 group-hover:-rotate-90`} />
      </div>
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
}

