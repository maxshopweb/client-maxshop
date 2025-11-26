'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'sonner';
import LogoGoogle from '@/app/components/icons/LogoGoogle';
import { loginSchema, emailSchema } from '@/app/schemas/auth.schema';
import { Mail, Lock } from 'lucide-react';

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    
    const { login, loginWithGoogle, isAuthenticated, role, user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    // Redirigir si ya está autenticado (solo si no está en proceso de login)
    useEffect(() => {
        if (isAuthenticated && !loading) {
            // Si el estado es 2, redirigir a completar perfil
            if (user?.estado === 2) {
                router.replace('/register/complete-perfil');
                return;
            }
            
            // Si el estado es 3 o no hay estado, redirigir según rol
            if (redirect) {
                router.push(redirect);
            } else {
                router.push(role === 'ADMIN' ? '/admin/home' : '/');
            }
        }
    }, [isAuthenticated, role, user, redirect, router, loading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const result = loginSchema.safeParse({ email, password });
            if (!result.success) {
                const fieldErrors: typeof errors = {};
                result.error.issues.forEach((err) => {
                    const path = err.path[0] as keyof typeof fieldErrors;
                    if (path) fieldErrors[path] = err.message;
                });
                setErrors(fieldErrors);
                setLoading(false);
                return;
            }

            const loginResult = await login(email, password);
            if (loginResult.success) {
                toast.success(loginResult.message || '¡Bienvenido de nuevo!');
                
                // Estado 2 = perfil incompleto -> completar perfil
                if (loginResult.estado === 2) {
                    // Las cookies ya están guardadas, usar router
                    router.replace('/register/complete-perfil');
                    return;
                }
                
                // Estado 3 = perfil completo -> redirigir según rol
                if (redirect) {
                    router.push(redirect);
                } else {
                    router.push(role === 'ADMIN' ? '/admin/home' : '/');
                }
            } else {
                toast.error(loginResult.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const result = await loginWithGoogle();
            if (result.success) {
                toast.success(result.message || '¡Bienvenido!');
                
                // Estado 2 = perfil incompleto -> completar perfil
                if (result.estado === 2) {
                    // Las cookies ya están guardadas, usar router para evitar recarga completa
                    router.replace('/register/complete-perfil');
                    return;
                }
                
                // Estado 3 = perfil completo -> redirigir según rol
                if (redirect) {
                    router.push(redirect);
                } else {
                    router.push(role === 'ADMIN' ? '/admin/home' : '/');
                }
            } else {
                toast.error(result.message || 'Error al iniciar sesión con Google');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Error al iniciar sesión con Google');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        if (errors.email) {
            const result = emailSchema.safeParse(value);
            if (result.success) {
                setErrors((prev) => ({ ...prev, email: undefined }));
            } else {
                setErrors((prev) => ({ ...prev, email: result.error.issues[0]?.message }));
            }
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (errors.password && value) {
            setErrors((prev) => ({ ...prev, password: undefined }));
        }
    };

    return (
        <AuthLayout title="Iniciar Sesión" subtitle="Bienvenido a MaxShop – Accede a tu cuenta">
            <div className="flex flex-col gap-4 sm:gap-5">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <Input
                            id="email"
                            type="email"
                            label="Tu email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="tu@email.com"
                            required
                            disabled={loading}
                            error={errors.email}
                            schema={emailSchema}
                            icon={Mail}
                        />

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
                    </div>

                    <div className="flex justify-end">
                        <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>

                    <div className="relative flex items-center gap-2 py-1.5">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="text-xs sm:text-sm text-gray-500">O continúa con</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    <Button
                        type="button"
                        variant="outline-primary"
                        size="sm"
                        fullWidth
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="text-[var(--principal)] hover:text-[var(--principal)]/80 hover:bg-[var(--principal)]/10 rounded-md"
                    >
                        <LogoGoogle />
                    </Button>
                </form>

                <p className="text-center text-gray-600 text-xs sm:text-sm">
                    ¿No tienes cuenta?{' '}
                    <Link href="/register" className="text-orange-600 hover:text-orange-700 font-semibold">
                        Regístrate
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}

// Componente principal con Suspense boundary
export default function LoginPage() {
    return (
        <Suspense fallback={
            <AuthLayout title="Iniciar Sesión" subtitle="Cargando...">
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                </div>
            </AuthLayout>
        }>
            <LoginContent />
        </Suspense>
    );
}
