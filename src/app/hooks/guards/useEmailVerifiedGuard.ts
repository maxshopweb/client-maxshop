'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { auth } from '@/app/lib/firebase.config';
import { toast } from 'sonner';

interface UseEmailVerifiedGuardOptions {
  redirectTo?: string;
}

/**
 * Hook para verificar que el email esté verificado en Firebase
 * 
 * Solo verifica si existe firebaseUser
 * Redirige a la ruta especificada si el email no está verificado
 */
export const useEmailVerifiedGuard = ({ 
  redirectTo = '/register/verify-email' 
}: UseEmailVerifiedGuardOptions = {}) => {
  const router = useRouter();
  const { firebaseUser, loading: authLoading } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Prevenir múltiples redirecciones
    if (hasRedirectedRef.current) return;

    // Esperar a que termine la carga inicial
    if (authLoading) return;

    // Obtener firebaseUser desde context o auth.currentUser
    const currentFirebaseUser = firebaseUser || auth.currentUser;

    // Verificar email verificado solo si hay firebaseUser
    if (currentFirebaseUser && !currentFirebaseUser.emailVerified) {
      hasRedirectedRef.current = true;
      toast.error('Debes verificar tu email antes de continuar');
      router.push(redirectTo);
      return;
    }
  }, [firebaseUser, authLoading, router, redirectTo]);
};

