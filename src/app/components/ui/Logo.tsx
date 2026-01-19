"use client";

import Image from "next/image";

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
}

export default function Logo({ width = 32, height = 32, className = "" }: LogoProps) {
    return (
        <Image
            src="/logos/logo-negativo.svg"
            width={width}
            height={height}
            alt="MaxShop"
            className={className}
        />
    );
}