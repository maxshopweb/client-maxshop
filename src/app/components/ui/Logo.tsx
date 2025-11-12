"use client";

import Image from "next/image";
import { useTheme } from "@/app/context/ThemeProvider";

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function Logo({ width = 32, height = 32, className = "" }: LogoProps) {
    const { actualTheme } = useTheme();
    
    return (
        <Image
            src={actualTheme === 'dark' ? "/logos/logo-positivo.svg" : "/logos/logo-negativo.svg"}
            width={width}
            height={height}
            alt="MaxShop"
            className={className}
        />
    );
}