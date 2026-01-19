import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { loginSchema, emailSchema } from '@/app/schemas/auth.schema';
import { getUserRole } from '@/app/utils/cookies';

export function useLogin(redirect: string | null = null) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    
    // Obtener el role del contexto - se actualiza automáticamente después del login
    const { login, loginWithGoogle, role } = useAuth();
    const router = useRouter();

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
                    router.replace('/register/complete-perfil');
                    return;
                }
                
                // Esperar un momento para que el contexto se actualice y las cookies se guarden
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Usar el role del contexto primero (más confiable), luego cookies como fallback
                const contextRole = role;
                const cookieRole = getUserRole();
                const userRole = (contextRole || cookieRole)?.trim().toUpperCase();
                
                // Estado 3 = perfil completo -> redirigir según rol
                // Verificar si es admin primero
                const isAdmin = userRole === 'ADMIN';
                
                if (redirect) {
                    // Si el usuario es admin y el redirect no es a /admin, redirigir a /admin
                    if (isAdmin && !redirect.startsWith('/admin')) {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = redirect;
                    }
                } else {
                    const targetPath = isAdmin ? '/admin' : '/';
                    // Usar window.location.href para forzar recarga completa
                    // Esto asegura que el middleware vea las cookies actualizadas
                    window.location.href = targetPath;
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
                    router.replace('/register/complete-perfil');
                    return;
                }
                
                // Esperar un momento para que el contexto se actualice y las cookies se guarden
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Usar el role del contexto primero (más confiable), luego cookies como fallback
                const contextRole = role;
                const cookieRole = getUserRole();
                const userRole = (contextRole || cookieRole)?.trim().toUpperCase();
                
                // Estado 3 = perfil completo -> redirigir según rol
                // Verificar si es admin primero
                const isAdmin = userRole === 'ADMIN';
                
                if (redirect) {
                    // Si el usuario es admin y el redirect no es a /admin, redirigir a /admin
                    if (isAdmin && !redirect.startsWith('/admin')) {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = redirect;
                    }
                } else {
                    const targetPath = isAdmin ? '/admin' : '/';
                    // Usar window.location.href para forzar recarga completa
                    // Esto asegura que el middleware vea las cookies actualizadas
                    window.location.href = targetPath;
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

