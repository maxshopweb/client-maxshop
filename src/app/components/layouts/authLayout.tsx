'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from 'react';
import { ArrowLeft, ShoppingBagIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    const { logout } = useAuth();
    const router = useRouter();

    const handleGoHome = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        await logout();
        router.push('/');
    };

    return (
        <div
            className="min-h-screen h-screen relative flex items-center justify-center overflow-hidden bg-[#fff5eb]"
        >
            {/* Fondo Base - Gradiente sutil y limpio */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(180deg, #fff5eb 0%, #fff0e3 50%, #ffe0cc 100%)',
                }}
            />

            {/* Orbes/Gradientes Orgánicos Animados con Framer Motion */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-[80px] opacity-50 z-0"
                style={{ background: '#ffa366' }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0]
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-0"
                style={{ background: '#ffcc99' }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.5, 0.3],
                    y: [0, -30, 0]
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                }}
                className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-[100px] opacity-40 z-0"
                style={{ background: '#ffead1' }}
            />

            {/* Mobile: Sheet centrado con diseño moderno */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="md:hidden w-full max-w-md mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col relative z-20 py-10"
            >
                <div className="flex flex-col px-6 pt-8 gap-6 overflow-y-auto">
                    {/* Header Nav */}
                    <div className="flex justify-between items-center">
                        <a
                            href="/"
                            onClick={handleGoHome}
                            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors font-medium p-2 -ml-2 rounded-full hover:bg-orange-50 cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Volver</span>
                        </a>
                        <Image src="/logos/logo-negativo.svg" alt="logo" width={40} height={40} className="w-10 h-10 object-contain" />
                        <div className="w-16" /> {/* Spacer para centrar visualmente el logo si fuera necesario, o dejarlo a la derecha */}
                    </div>

                    {/* Title Section */}
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                        {children}
                    </div>
                </div>
            </motion.div>

            {/* Desktop: Card Flotante Moderna */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="hidden md:flex w-full max-w-5xl bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden flex-row relative z-30 mx-6 min-h-[600px] lg:min-h-[650px]"
            >
                {/* Visual Side (Left) */}
                <div className="w-1/2 relative overflow-hidden bg-gray-900">
                    <Image
                        src="/imgs/login.jpg"
                        alt="MaxShop Background"
                        fill
                        sizes="50vw"
                        className="object-cover opacity-90 hover:scale-105 transition-transform duration-[20s]"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-12">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col gap-4"
                        >
                            <ShoppingBagIcon className="w-10 h-10 text-white" />
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                Construye tus ideas con <span className="text-orange-400">MaxShop</span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed max-w-sm">
                                Accede a miles de productos y herramientas de calidad profesional.
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Content Side (Right) */}
                <div className="w-1/2 flex flex-col p-12 lg:p-16 relative">
                    <div className="absolute top-8 right-8">
                        <Image src="/logos/logo-negativo.svg" alt="logo" width={50} height={50} className="w-10 h-10 opacity-80" />
                    </div>

                    <div className="flex flex-col h-full justify-center max-w-sm mx-auto w-full">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
                            {subtitle && <p className="text-gray-500">{subtitle}</p>}
                        </div>

                        {children}

                        <div className="mt-auto pt-6 border-t border-gray-100 flex justify-center">
                            <a
                                href="/"
                                onClick={handleGoHome}
                                className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                Volver al inicio
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
