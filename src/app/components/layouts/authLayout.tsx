'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="h-screen bg-[var(--principal)] flex items-center justify-center p-6 sm:p-8 lg:p-12 overflow-hidden">
            <div className="w-full h-full max-w-5xl bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                {/* Left Section - Image background (desktop only) */}
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                    <Image
                        src="/imgs/login.jpg"
                        alt="MaxShop - Herramientas y tecnología"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay with text - más sutil */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/35 to-gray-900/40 z-10 p-8 lg:p-12 flex flex-col justify-between">
                        <div className="relative z-10 flex flex-col gap-3">
                            <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight drop-shadow-lg">
                                Las mejores herramientas para hacer realidad tus proyectos
                            </h2>
                            <p className="text-gray-100 text-sm lg:text-base drop-shadow-md">
                                Herramientas profesionales, tecnología de calidad y todo lo que necesitas en un solo lugar
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Section - White with form */}
                <div className="w-full lg:w-1/2 flex flex-col overflow-hidden">
                    <div className="h-full flex flex-col overflow-hidden">
                        {/* Form content - scrollable */}
                        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-visible">
                            <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
                                <div className="max-w-lg mx-auto w-full flex flex-col gap-4">
                                    {/* Logo */}
                                    <div className="flex justify-center sm:justify-start">
                                        <Image src="/logos/logo-negativo.svg" alt="logo" width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 lg:w-20 lg:h-20" />
                                    </div>

                                    {/* Title and Subtitle */}
                                    <div className="flex flex-col gap-1.5 text-center sm:text-left">
                                        <h1 className="text-2xl sm:text-2xl lg:text-2xl font-bold text-gray-900">
                                            {title}
                                        </h1>
                                        {subtitle && (
                                            <p className="text-sm sm:text-sm text-gray-600">
                                                {subtitle}
                                            </p>
                                        )}
                                    </div>

                                    {/* Form content */}
                                    <div className="flex flex-col gap-4">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
