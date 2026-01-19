import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { auth } from '@/app/lib/firebase.config';
import { signOut } from 'firebase/auth';
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/userStore";
import { clearAuthCookies } from "@/app/utils/cookies";

export const useHandleResendEmailVerification = () => {
    const router = useRouter();
    const { resendEmailVerification, firebaseUser } = useAuth();
    const logoutStore = useAuthStore((state) => state.logout);

    const [resending, setResending] = useState(false);
    const [checking, setChecking] = useState(false);
    const [email, setEmail] = useState<string | null>(null);

    // Inicializar email cuando firebaseUser esté disponible
    useEffect(() => {
        if (firebaseUser?.email) {
            setEmail(firebaseUser.email);
        }
    }, [firebaseUser]);

    const handleResendEmail = async () => {
        setResending(true);
        try {
            const success = await resendEmailVerification();
            if (success) {
                toast.success('Email de verificación reenviado. Revisa tu bandeja de entrada.');
            } else {
                toast.error('Error al reenviar el email. Intenta más tarde.');
            }
        } catch (error: any) {
            console.error('Error al reenviar email:', error);
            toast.error('Error al reenviar el email de verificación.');
        } finally {
            setResending(false);
        }
    };

    const handleCheckVerification = async () => {
        setChecking(true);
        try {
            // Obtener el usuario actual desde Firebase o desde el contexto
            let currentUser = auth.currentUser || firebaseUser;

            if (!currentUser) {
                toast.error('No hay usuario autenticado. Por favor, regístrate nuevamente.');
                router.push('/register');
                return;
            }

            // Forzar reload del usuario para obtener el estado más reciente
            await currentUser.reload();

            // Después del reload, el objeto currentUser ya está actualizado
            // No necesitamos obtener auth.currentUser de nuevo
            if (!currentUser.emailVerified) {
                // Si después del reload aún no está verificado, verificar auth.currentUser como fallback
                const fallbackUser = auth.currentUser;
                if (fallbackUser && fallbackUser.emailVerified) {
                    currentUser = fallbackUser;
                } else {
                    toast.info('El email aún no ha sido verificado. Por favor, revisa tu bandeja de entrada.');
                    setChecking(false);
                    return;
                }
            }

            // Forzar refresh del token para que el backend reciba el estado actualizado
            await currentUser.getIdToken(true);

            // Verificar el estado una vez más después del token refresh
            if (currentUser.emailVerified) {
                toast.success('¡Email verificado exitosamente!');
                
                // Forzar sincronización con backend para actualizar estado a 2
                // El onAuthStateChanged debería hacerlo, pero lo forzamos aquí también
                const AuthIntegrationService = (await import('@/app/services/auth.integration.service')).default;
                try {
                    await AuthIntegrationService.syncAfterEmailVerification();
                } catch (error) {
                    console.error('Error al sincronizar después de verificar email:', error);
                }
                
                // Esperar un momento para que la sincronización termine
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // El guard manejará la redirección automáticamente
                router.push('/register/complete-perfil');
            } else {
                toast.info('El email aún no ha sido verificado. Por favor, revisa tu bandeja de entrada.');
            }
        } catch (error: any) {
            console.error('Error al verificar email:', error);
            toast.error('Error al verificar el estado del email.');
        } finally {
            setChecking(false);
        }
    };

    const handleBackRegister = async () => {
        try {
            // Cerrar sesión en Firebase
            await signOut(auth);
            
            // Limpiar store de Zustand
            logoutStore();
            
            // Limpiar cookies
            clearAuthCookies();
            
            // Limpiar localStorage y sessionStorage (excepto theme)
            if (typeof window !== 'undefined') {
                const theme = localStorage.getItem('theme');
                localStorage.clear();
                if (theme) {
                    localStorage.setItem('theme', theme);
                }
                sessionStorage.clear();
            }
            
            // Mostrar toast
            toast.success('Sesión cerrada correctamente');
            
            // Redirigir a register
            window.location.href = '/register';
        } catch (error) {
            console.error('Error al hacer logout:', error);
            // Aunque haya error, limpiar todo y redirigir
            logoutStore();
            clearAuthCookies();
            if (typeof window !== 'undefined') {
                const theme = localStorage.getItem('theme');
                localStorage.clear();
                if (theme) {
                    localStorage.setItem('theme', theme);
                }
                sessionStorage.clear();
                window.location.href = '/register';
            }
        }
    }

    return {
        resending,
        checking,
        email,
        handleResendEmail,
        handleCheckVerification,
        handleBackRegister
    }
}