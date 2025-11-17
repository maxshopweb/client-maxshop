'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AuthLayout from '@/app/components/layouts/authLayout';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'sonner';
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { auth } from '@/app/lib/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const { resendEmailVerification, firebaseUser, user, loading } = useAuth();
  const router = useRouter();
  const previousEmailVerifiedRef = useRef<boolean>(firebaseUser?.emailVerified ?? false);

  // Proteger ruta: requiere autenticación
  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        toast.error('Debes estar autenticado para verificar tu email');
        router.push('/register');
        return;
      }
      
      // Si el email ya está verificado, redirigir al step 2
      if (firebaseUser.emailVerified && user?.estado === 2) {
        router.push('/register/complete-perfil');
        return;
      }
      
      // Si el email está verificado pero el estado no es 2, redirigir según el rol
      if (firebaseUser.emailVerified && user?.estado !== 2) {
        router.push('/');
        return;
      }
    }
  }, [firebaseUser, user, loading, router]);

  useEffect(() => {
    // Obtener email del usuario actual
    if (firebaseUser) {
      setEmail(firebaseUser.email);
    } else {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setEmail(currentUser.email);
      }
    }

    // Actualizar la referencia cuando firebaseUser cambia
    if (firebaseUser) {
      previousEmailVerifiedRef.current = firebaseUser.emailVerified ?? false;
    }

    // Escuchar cambios en el estado de autenticación para verificar cuando el email se verifica
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Recargar usuario para obtener el estado más reciente de emailVerified
        try {
          await user.reload();
          
          // Verificar si el email se acaba de verificar (cambio de false a true)
          const currentEmailVerified = user.emailVerified;
          const previousEmailVerified = previousEmailVerifiedRef.current;
          
          if (currentEmailVerified && !previousEmailVerified) {
            // Email acaba de ser verificado, forzar refresh del token
            await user.getIdToken(true);
            
            // Esperar un poco para que el contexto se actualice
            setTimeout(() => {
              toast.success('¡Email verificado exitosamente!');
              // Redirigir al Step 2 si tiene estado 2
              router.push('/register/complete-perfil');
            }, 1000);
          }
          
          // Actualizar la referencia con el valor actual
          previousEmailVerifiedRef.current = currentEmailVerified;
        } catch (error) {
          console.error('Error al refrescar token:', error);
        }
      } else {
        previousEmailVerifiedRef.current = false;
      }
    });

    return () => unsubscribe();
  }, [router, firebaseUser]);

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
        
        // Esperar un poco para que el contexto se actualice con el nuevo estado
        // El listener de onAuthStateChanged debería actualizar el contexto
        setTimeout(() => {
          router.push('/register/complete-perfil');
        }, 1000);
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

  return (
    <AuthLayout
      title="Verifica tu email"
      subtitle="Necesitamos confirmar tu dirección de correo"
    >
      <div className="flex flex-col gap-6">
        {/* Icono y mensaje */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
            <Mail className="w-10 h-10 text-orange-600" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Revisa tu bandeja de entrada
            </h3>
            {email && (
              <p className="text-sm text-gray-600">
                Hemos enviado un email de verificación a{' '}
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
            )}
            <p className="text-sm text-gray-600">
              Haz clic en el enlace del email para verificar tu cuenta y continuar.
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">¿No recibiste el email?</p>
              <ul className="text-xs text-blue-800 mt-1 space-y-1 list-disc list-inside">
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>Asegúrate de que el email esté escrito correctamente</li>
                <li>Puede tardar unos minutos en llegar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={handleCheckVerification}
            disabled={checking}
          >
            {checking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Ya verifiqué mi email
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline-primary"
            size="md"
            fullWidth
            onClick={handleResendEmail}
            disabled={resending}
            className="text-[var(--principal)] hover:text-[var(--principal)]"
          >
            {resending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Reenviar email de verificación
              </>
            )}
          </Button>
        </div>

        {/* Link de regreso */}
        <p className="text-center text-gray-600 text-sm">
          ¿Cambiaste de opinión?{' '}
          <button
            onClick={() => {
              auth.signOut();
              router.push('/register');
            }}
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Volver al registro
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

