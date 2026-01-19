'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';
import { auth } from '@/app/lib/firebase.config';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthStore } from '@/app/stores/userStore';

export function useEmailVerificationGuard() {
  const { firebaseUser, user, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false); // Prevenir múltiples redirecciones
  const token = useAuthStore((state) => state.token);
  const usuarioStore = useAuthStore((state) => state.usuario);

  useEffect(() => {
    if (loading) return;

    // Si hay token en el store, el usuario está registrado (aunque Firebase aún no se haya sincronizado)
    // Esperar un poco para que Firebase se sincronice después de la verificación
    if (!firebaseUser && token) {
      // El usuario está registrado pero Firebase aún no se sincronizó
      // Esperar un poco para que Firebase detecte la verificación
      const waitForFirebase = setTimeout(async () => {
        if (hasRedirected.current) return;
        
        // Intentar obtener el usuario de Firebase
        const currentFirebaseUser = auth.currentUser;
        if (currentFirebaseUser) {
          await currentFirebaseUser.reload();
          if (currentFirebaseUser.emailVerified) {
            hasRedirected.current = true;
            // Email verificado, redirigir a complete-perfil
            router.push('/register/complete-perfil');
            return;
          }
        }
        
        // Si aún no hay firebaseUser pero hay token, asumir que el email se verificó
        // y redirigir a complete-perfil (el AuthContext se encargará de sincronizar)
        if (!currentFirebaseUser && token) {
          hasRedirected.current = true;
          router.push('/register/complete-perfil');
        }
      }, 2000); // Esperar 2 segundos para que Firebase se sincronice
      
      return () => clearTimeout(waitForFirebase);
    }

    // Si no hay token ni firebaseUser, redirigir a registro
    if (!firebaseUser && !token) {
      toast.error('Debes estar autenticado para verificar tu email');
      router.push('/register');
      return;
    }

    // Si ya está verificado
    if (firebaseUser?.emailVerified && !hasRedirected.current) {
      // Esperar a que el usuario se sincronice con el backend antes de decidir a dónde redirigir
      // Esto es importante porque después de verificar el email, el backend necesita sincronizarse
      const checkUserAndRedirect = async () => {
        // Esperar un poco para que el backend se sincronice
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Verificar el usuario del store (más rápido) o del contexto
        const storeUser = useAuthStore.getState().usuario;
        const currentUser = storeUser || user;
        
        // Si el usuario está sincronizado, verificar su estado
        if (currentUser) {
          hasRedirected.current = true;
          // Si el estado es 3 (perfil completo), puede ir a home
          // Si el estado es 1 o 2, DEBE completar perfil
          if (currentUser.estado === 3) {
            router.push('/');
          } else {
            // Estado 1 o 2: debe completar perfil
            router.push('/register/complete-perfil');
          }
        } else {
          // Si aún no está sincronizado, redirigir a complete-perfil de todas formas
          // porque el usuario acaba de verificar su email y debería estar en estado 2
          hasRedirected.current = true;
          router.push('/register/complete-perfil');
        }
      };
      
      checkUserAndRedirect();
      return;
    }

    // Listener para detectar verificación automática
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser || hasRedirected.current) return;

      await fbUser.reload();

      if (fbUser.emailVerified) {
        hasRedirected.current = true;
        await fbUser.getIdToken(true);

        toast.success('¡Email verificado exitosamente!');
        
        // Esperar un momento para que el backend se sincronice
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Siempre redirigir a complete-perfil después de verificar email
        // El guard de estado se encargará de redirigir si ya está completo
        router.push('/register/complete-perfil');
      }
    });

    return () => unsubscribe();
  }, [firebaseUser, user, loading, router, token, usuarioStore]);
}
