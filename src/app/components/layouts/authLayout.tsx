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
        <div className="min-h-screen relative flex items-end lg:items-center justify-center overflow-hidden" style={{ backgroundColor: '#fff5eb' }}>
            {/* Gradiente base suave - Naranja equilibrado a Blanco */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(135deg, #fff5eb 0%, #ffe5d4 20%, #ffd4b3 40%, #ffc299 60%, #ffb380 80%, #ffa366 100%)',
                }}
            />
            
            {/* Formas orgánicas (Shapes) con gradientes radiales - Capa 1 */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 800px 600px at 10% 20%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 220, 180, 0.3) 30%, transparent 60%),
                        radial-gradient(ellipse 600px 800px at 90% 80%, rgba(255, 200, 160, 0.4) 0%, rgba(255, 220, 190, 0.25) 40%, transparent 70%),
                        radial-gradient(ellipse 700px 500px at 50% 10%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 230, 200, 0.2) 35%, transparent 65%),
                        radial-gradient(ellipse 500px 700px at 20% 70%, rgba(255, 210, 170, 0.35) 0%, rgba(255, 230, 200, 0.2) 30%, transparent 60%),
                        radial-gradient(ellipse 600px 600px at 80% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 220, 180, 0.15) 25%, transparent 55%)
                    `,
                }}
            />
            
            {/* Formas orgánicas adicionales - Capa 2 */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle 400px at 30% 50%, rgba(255, 255, 255, 0.4) 0%, transparent 50%),
                        radial-gradient(circle 350px at 70% 60%, rgba(255, 200, 160, 0.25) 0%, transparent 45%),
                        radial-gradient(circle 300px at 15% 85%, rgba(255, 220, 180, 0.3) 0%, transparent 40%),
                        radial-gradient(circle 450px at 85% 15%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                        radial-gradient(circle 380px at 50% 90%, rgba(255, 210, 170, 0.2) 0%, transparent 42%)
                    `,
                    mixBlendMode: 'overlay',
                    opacity: 0.6,
                }}
            />
            
            {/* Naranjas en las esquinas - Más visibles */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(ellipse 600px 600px at 0% 0%, rgba(255, 180, 140, 0.5) 0%, rgba(255, 200, 170, 0.3) 30%, transparent 60%),
                        radial-gradient(ellipse 600px 600px at 100% 0%, rgba(255, 175, 135, 0.5) 0%, rgba(255, 195, 165, 0.3) 30%, transparent 60%),
                        radial-gradient(ellipse 600px 600px at 0% 100%, rgba(255, 185, 145, 0.5) 0%, rgba(255, 205, 175, 0.3) 30%, transparent 60%),
                        radial-gradient(ellipse 600px 600px at 100% 100%, rgba(255, 170, 130, 0.5) 0%, rgba(255, 190, 160, 0.3) 30%, transparent 60%)
                    `,
                }}
            />
            
            {/* Ruido/textura minimalista estilo Apple - Capa principal */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.12]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E")`,
                    backgroundSize: '250px 250px',
                    backgroundRepeat: 'repeat',
                    mixBlendMode: 'soft-light',
                }}
            />
            
            {/* Ruido/textura adicional - Capa sutil */}
            <div 
                className="absolute inset-0 z-0 opacity-[0.06]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter2'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter2)' opacity='0.35'/%3E%3C/svg%3E")`,
                    backgroundSize: '180px 180px',
                    backgroundRepeat: 'repeat',
                    mixBlendMode: 'overlay',
                }}
            />
            
            {/* Overlay sutil para unificar */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(255, 245, 235, 0.1) 100%)',
                }}
            />

            {/* Mobile: Sheet desde abajo con bordes redondeados arriba */}
            <div className="lg:hidden w-full bg-white rounded-t-3xl shadow-2xl overflow-hidden flex flex-col min-h-[85vh] max-h-[95vh] mt-auto relative z-10">
                {/* Form content */}
                <div className="flex-1 flex flex-col p-6 overflow-y-auto scrollbar-visible">
                    <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                        {/* Logo */}
                        <div className="flex justify-center mb-6">
                            <Image src="/logos/logo-negativo.svg" alt="logo" width={80} height={80} className="w-16 h-16" />
                        </div>

                        {/* Title and Subtitle */}
                        <div className="flex flex-col gap-2 mb-8 text-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-sm text-gray-600">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Form content */}
                        <div className="flex-1 flex flex-col justify-center">
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop: Layout tradicional centrado */}
            <div className="hidden lg:flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex-row min-h-[700px] relative z-20">
                {/* Left Section - Image background */}
                <div className="lg:w-1/2 relative overflow-hidden">
                    <Image
                        src="/imgs/login.jpg"
                        alt="MaxShop - Herramientas y tecnología"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Overlay with text */}
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
                <div className="w-full lg:w-1/2 flex flex-col">
                    <div className="flex-1 flex flex-col p-10 xl:p-12">
                        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
                            {/* Logo */}
                            <div className="flex justify-start mb-6">
                                <Image src="/logos/logo-negativo.svg" alt="logo" width={80} height={80} className="w-20 h-20" />
                            </div>

                            {/* Title and Subtitle */}
                            <div className="flex flex-col gap-2 mb-8 text-left">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-base text-gray-600">
                                        {subtitle}
                                    </p>
                                )}
                            </div>

                            {/* Form content */}
                            <div className="flex-1 flex flex-col justify-center">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
