'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthStore } from '@/app/stores/userStore';
import { auth } from '@/app/lib/firebase.config';
import { toast } from 'sonner';

interface UseAuthGuardOptions {
  redirectTo?: string;
  waitForSync?: boolean;
}

/**
 * Hook para verificar autenticación
 * 
 * REGLA: Usuario está autenticado SOLO si estado === 3 (perfil completo)
 * Si estado < 3, NO está autenticado y debe completar el flujo de registro
 */
export const useAuthGuard = ({ 
  redirectTo = '/login',
  waitForSync = true 
}: UseAuthGuardOptions = {}) => {
  const router = useRouter();
  const { user, firebaseUser, loading: authLoading } = useAuth();
  const usuarioStore = useAuthStore((state) => state.usuario);
  const token = useAuthStore((state) => state.token);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (hasRedirectedRef.current) return;
    if (authLoading) return;

    const currentUser = usuarioStore || user;
    const currentFirebaseUser = firebaseUser || auth.currentUser;

    // Si no hay token ni firebaseUser, no está autenticado
    if (!token && !currentFirebaseUser) {
      hasRedirectedRef.current = true;
      toast.error('Debes estar autenticado para acceder a esta página');
      router.push(redirectTo);
      return;
    }

    // Si hay token/firebaseUser pero NO hay usuario en store, esperar un poco
    if ((token || currentFirebaseUser) && !currentUser) {
      if (waitForSync) {
        const timer = setTimeout(() => {
          const checkUser = useAuthStore.getState().usuario;
          if (checkUser && !hasRedirectedRef.current) {
            // Verificar estado del usuario sincronizado
            if (checkUser.estado !== 3) {
              hasRedirectedRef.current = true;
              // Redirigir según el estado
              if (checkUser.estado === 1 || checkUser.estado === null) {
                router.push('/register/verify-email');
              } else if (checkUser.estado === 2) {
                router.push('/register/complete-perfil');
              } else {
                router.push(redirectTo);
              }
            }
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
      return;
    }

    // Si hay usuario, verificar que estado === 3 (autenticado completamente)
    if (currentUser) {
      if (currentUser.estado !== 3) {
        hasRedirectedRef.current = true;
        // Redirigir según el estado
        if (currentUser.estado === 1 || currentUser.estado === null) {
          router.push('/register/verify-email');
        } else if (currentUser.estado === 2) {
          router.push('/register/complete-perfil');
        } else {
          router.push(redirectTo);
        }
        return;
      }
    }

    // Si llegamos aquí, el usuario está autenticado (estado === 3)
  }, [firebaseUser, user, usuarioStore, token, authLoading, router, redirectTo, waitForSync]);
};

