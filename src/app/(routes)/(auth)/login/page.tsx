'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import LogoGoogle from '@/app/components/icons/LogoGoogle';
import { emailSchema } from '@/app/schemas/auth.schema';
import { Mail, Lock, ChevronDown, ArrowRight, User } from 'lucide-react';
import { useLogin } from '@/app/hooks/auth/useLogin';
import { motion, AnimatePresence } from 'framer-motion';

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

function LoginContent() {
    const {
        email,
        password,
        loading,
        errors,
        handleSubmit,
        handleGoogleLogin,
        handleEmailChange,
        handlePasswordChange,
    } = useLogin();

    const [isEmailExpanded, setIsEmailExpanded] = useState(false);

    return (
        <AuthLayout title="¡Hola de nuevo!" subtitle="Elige cómo quieres iniciar sesión">
            <div className="flex flex-col h-full justify-between w-full">
                <div className="flex flex-col gap-6 flex-1 justify-center">
                    {/* 1. Primary CTA: Google Login */}
                    <motion.div
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full px-1"
                    >
                        <Button
                            type="button"
                            variant="white-primary"
                            size="lg"
                            fullWidth
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="relative group h-14 sm:h-16 text-base sm:text-lg shadow-sm border border-gray-200 hover:border-orange-200 hover:bg-orange-50/50 transition-all duration-300"
                        >
                            <div className="absolute left-4 sm:left-6 flex items-center justify-center bg-white p-1 rounded-full shadow-sm">
                                <LogoGoogle />
                            </div>
                            <span className="text-gray-700 font-semibold group-hover:text-orange-700 transition-colors pl-8">
                                Continuar con Google
                            </span>
                        </Button>
                    </motion.div>

                    {/* Separator / Divider */}
                    <div className="relative flex items-center gap-4 py-4 opacity-60 flex-shrink-0">
                        <div className="flex-1 border-t border-gray-200"></div>
                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">o</span>
                        <div className="flex-1 border-t border-gray-200"></div>
                    </div>

                    {/* 2. Secondary Option: Email Login */}
                    <AnimatePresence mode="wait">
                    {!isEmailExpanded ? (
                        <motion.button
                            key="expand-btn"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                            onClick={() => setIsEmailExpanded(true)}
                            className="w-full py-4 flex items-center justify-between px-6 rounded-2xl border border-gray-200 hover:border-orange-300 hover:shadow-md hover:bg-white bg-gray-50/50 transition-all duration-300 group text-left cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                                    <Mail size={20} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">Continuar con email</span>
                                    <span className="text-xs text-gray-500">Ingresa tu correo y contraseña</span>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-400 group-hover:text-orange-500 transition-colors">
                                <ArrowRight size={16} />
                            </div>
                        </motion.button>
                    ) : (
                        <motion.form
                            key="email-form"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-5">
                                <Input
                                    id="email"
                                    type="email"
                                    label="Tu correo electrónico"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="ejemplo@correo.com"
                                    required
                                    disabled={loading}
                                    error={errors.email}
                                    schema={emailSchema}
                                    icon={Mail}
                                />

                                <div>
                                    <Input
                                        id="password"
                                        type="password"
                                        label="Contraseña"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                        required
                                        disabled={loading}
                                        error={errors.password}
                                        icon={Lock}
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-medium text-gray-500 hover:text-orange-600 transition-colors"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 flex flex-col gap-4 px-1">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    disabled={loading}
                                    className="h-12 shadow-lg shadow-orange-500/20"
                                >
                                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                </Button>

                                <button
                                    type="button"
                                    onClick={() => setIsEmailExpanded(false)}
                                    className="text-sm text-gray-400 hover:text-gray-600 font-medium py-2 text-center transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </motion.form>
                    )}
                    </AnimatePresence>
                </div>

                {/* Footer Links */}
                <div className="text-center flex-shrink-0 py-6">
                    <p className="text-sm text-gray-600">
                        ¿Aún no tienes cuenta?{' '}
                        <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all">
                            Regístrate gratis
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}

// Componente principal con Suspense boundary
export default function LoginPage() {
    return (
        <Suspense fallback={
            <AuthLayout title="Iniciando..." subtitle="Por favor espere">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
                </div>
            </AuthLayout>
        }>
            <LoginContent />
        </Suspense>
    );
}
