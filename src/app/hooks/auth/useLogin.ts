import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { loginSchema, emailSchema } from '@/app/schemas/auth.schema';
import { getUserRole } from '@/app/utils/cookies';

export function useLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    
    const { login, loginWithGoogle } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect');

    // NO redirigir automáticamente - solo redirigir cuando el usuario hace login explícitamente

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
                
                // Esperar un momento para que las cookies se guarden
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Leer el role de las cookies directamente (más confiable que el contexto)
                const userRole = getUserRole();
                
                // Estado 3 = perfil completo -> redirigir según rol
                if (redirect) {
                    router.push(redirect);
                } else {
                    const targetPath = userRole === 'ADMIN' ? '/admin' : '/';
                    router.push(targetPath);
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
                
                // Esperar un momento para que las cookies se guarden
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Leer el role de las cookies directamente (más confiable que el contexto)
                const userRole = getUserRole();
                
                // Estado 3 = perfil completo -> redirigir según rol
                if (redirect) {
                    router.push(redirect);
                } else {
                    const targetPath = userRole === 'ADMIN' ? '/admin' : '/';
                    router.push(targetPath);
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

    return {
        email,
        password,
        loading,
        errors,
        handleSubmit,
        handleGoogleLogin,
        handleEmailChange,
        handlePasswordChange,
    };
}

