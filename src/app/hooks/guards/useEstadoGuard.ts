'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthStore } from '@/app/stores/userStore';

interface UseEstadoGuardOptions {
  requiredEstado: number;
  redirectOnComplete?: {
    admin?: string;
    user?: string;
  };
  redirectOnInvalid?: {
    admin?: string;
    user?: string;
  };
}

/**
 * Hook para verificar el estado del usuario (estado)
 * 
 * Si estado === 3 → redirige según rol (perfil completo)
 * Si estado !== requiredEstado y !== null → redirige según rol (estado inválido)
 * 
 * Usa useAuthStore primero (más rápido) o context como fallback
 */
export const useEstadoGuard = ({
  requiredEstado,
  redirectOnComplete = {
    admin: '/admin/home',
    user: '/'
  },
  redirectOnInvalid = {
    admin: '/admin/home',
    user: '/'
  }
}: UseEstadoGuardOptions) => {
  const router = useRouter();
  const { user, role, firebaseUser, loading: authLoading } = useAuth();
  const usuarioStore = useAuthStore((state) => state.usuario);
  const token = useAuthStore((state) => state.token);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // Prevenir múltiples redirecciones
    if (hasRedirectedRef.current) return;

    // Esperar a que termine la carga inicial
    if (authLoading) return;

    // Usar el usuario del store o del contexto (el store se actualiza más rápido)
    const currentUser = usuarioStore || user;

    // Si no hay usuario pero hay firebaseUser y token, esperar un poco
    // (el usuario puede estar sincronizándose con el backend)
    if (!currentUser) {
      // Si hay firebaseUser y token, el usuario está autenticado y solo está sincronizando
      // Esperar un poco antes de verificar el estado
      if (firebaseUser && token) {
        const timer = setTimeout(() => {
          const checkUser = useAuthStore.getState().usuario;
          const checkRole = useAuthStore.getState().usuario?.rol;
          if (checkUser && !hasRedirectedRef.current) {
            // El usuario se sincronizó, verificar el estado ahora
            const checkEstado = checkUser.estado;
            
            if (checkEstado === 3) {
              hasRedirectedRef.current = true;
              const redirectPath = checkRole === 'ADMIN' 
                ? redirectOnComplete.admin 
                : redirectOnComplete.user;
              router.replace(redirectPath || '/');
            } else if (checkEstado !== requiredEstado && checkEstado !== null) {
              hasRedirectedRef.current = true;
              const redirectPath = checkRole === 'ADMIN' 
                ? redirectOnInvalid.admin 
                : redirectOnInvalid.user;
              router.replace(redirectPath || '/');
            }
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
      // Si no hay firebaseUser ni token, no hacer nada (el useAuthGuard se encargará)
      return;
    }

    // Si el estado no es el requerido, redirigir según el rol
    const currentEstado = currentUser.estado;
    const currentRole = role || currentUser.rol;

    // Si estado === 3 (perfil completo), redirigir inmediatamente
    if (currentEstado === 3) {
      hasRedirectedRef.current = true;
      const redirectPath = currentRole === 'ADMIN' 
        ? redirectOnComplete.admin 
        : redirectOnComplete.user;
      router.replace(redirectPath || '/');
      return;
    }

    // Si el estado es diferente de requiredEstado y no es null, redirigir
    if (currentEstado !== requiredEstado && currentEstado !== null) {
      hasRedirectedRef.current = true;
      const redirectPath = currentRole === 'ADMIN' 
        ? redirectOnInvalid.admin 
        : redirectOnInvalid.user;
      router.replace(redirectPath || '/');
      return;
    }
  }, [user, usuarioStore, role, firebaseUser, token, authLoading, router, requiredEstado, redirectOnComplete, redirectOnInvalid]);
};

