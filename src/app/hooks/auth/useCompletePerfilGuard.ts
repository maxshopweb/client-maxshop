'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthStore } from '@/app/stores/userStore';
import { auth } from '@/app/lib/firebase.config';

/**
 * Hook que maneja la lógica de guard para la página de completar perfil.
 * Solo permite acceso si:
 * - El email está verificado en Firebase (estado se actualizará después)
 * - El usuario tiene estado === 2 (email verificado pero perfil incompleto)
 * 
 * Redirige automáticamente según el estado del usuario:
 * - Sin token/firebaseUser -> /register
 * - Email no verificado -> /register/verify-email
 * - Estado 3 (perfil completo) -> /admin/home o /
 * - Estado 2 -> Permite acceso (debe completar perfil)
 */
export function useCompletePerfilGuard() {
  const router = useRouter();
  const { user, firebaseUser, loading: authLoading } = useAuth();
  const usuarioStore = useAuthStore((state) => state.usuario);
  const token = useAuthStore((state) => state.token);
  const hasRedirectedRef = useRef(false);
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const syncInProgressRef = useRef(false);

  useEffect(() => {
    // Limpiar timer anterior si existe
    if (checkTimerRef.current) {
      clearTimeout(checkTimerRef.current);
      checkTimerRef.current = null;
    }

    if (hasRedirectedRef.current || authLoading) return;

    const currentUser = usuarioStore || user;
    const currentFirebaseUser = firebaseUser || auth.currentUser;
    const emailVerified = currentFirebaseUser?.emailVerified ?? false;
    
    // Si no hay token ni firebaseUser, redirigir a registro
    if (!token && !currentFirebaseUser) {
      hasRedirectedRef.current = true;
      router.push('/register');
      return;
    }

    // Si hay token/firebaseUser pero NO hay usuario aún, esperar un poco para sincronización
    if ((token || currentFirebaseUser) && !currentUser) {
      // Esperar máximo 2 segundos para que se sincronice
      checkTimerRef.current = setTimeout(() => {
        if (hasRedirectedRef.current) return;
        const checkUser = useAuthStore.getState().usuario;
        if (!checkUser) {
          // Si después de esperar aún no hay usuario, redirigir a registro
          hasRedirectedRef.current = true;
          router.push('/register');
        }
      }, 2000);
      return;
    }

    // REGLA PRINCIPAL: Si el email está verificado en Firebase, permitir acceso
    // El backend actualizará el estado a 2 cuando se sincronice
    if (emailVerified) {
      // Si el email está verificado pero el estado es 1, forzar sincronización
      if (currentUser && currentUser.estado === 1 && !syncInProgressRef.current) {
        syncInProgressRef.current = true;
        const syncUser = async () => {
          try {
            const AuthIntegrationService = (await import('@/app/services/auth.integration.service')).default;
            const syncResult = await AuthIntegrationService.syncAfterEmailVerification();
            
            if (syncResult.success && syncResult.data) {
              // Esperar un momento para que el store se actualice
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Verificar el estado actualizado
              const updatedUser = useAuthStore.getState().usuario;
              if (updatedUser && updatedUser.estado === 2) {
                // Estado actualizado correctamente, permitir acceso
                syncInProgressRef.current = false;
                return;
              }
            }
          } catch (error) {
            console.error('Error al sincronizar usuario después de verificar email:', error);
          } finally {
            syncInProgressRef.current = false;
          }
        };
        syncUser();
        return; // Esperar a que se sincronice antes de continuar
      }
      
      // Si el email está verificado y el estado es 2 o 3, permitir acceso
      if (currentUser) {
        const estado = currentUser.estado;
        
        // Si estado === 3, ya completó perfil, redirigir
        if (estado === 3) {
          hasRedirectedRef.current = true;
          const redirectPath = currentUser.rol === 'ADMIN' ? '/admin/home' : '/';
          router.replace(redirectPath);
          return;
        }
        
        // Si estado === 2, permitir acceso (perfil incompleto, debe completar)
        if (estado === 2) {
          return; // Permitir acceso
        }
        
        // Si estado === 1 pero email verificado, esperar sincronización
        if (estado === 1) {
          // Ya se está sincronizando arriba, solo esperar
          return;
        }
        
        // Si estado === null, esperar un poco más
        if (estado === null) {
          checkTimerRef.current = setTimeout(() => {
            if (hasRedirectedRef.current) return;
            const checkUser = useAuthStore.getState().usuario;
            if (checkUser) {
              const checkEstado = checkUser.estado;
              if (checkEstado === 3) {
                hasRedirectedRef.current = true;
                const redirectPath = checkUser.rol === 'ADMIN' ? '/admin/home' : '/';
                router.replace(redirectPath);
              } else if (checkEstado === 2) {
                // Estado actualizado, permitir acceso
                return;
              }
            }
          }, 1000);
          return;
        }
      } else {
        // Email verificado pero no hay usuario en store, esperar sincronización
        checkTimerRef.current = setTimeout(() => {
          if (hasRedirectedRef.current) return;
          const checkUser = useAuthStore.getState().usuario;
          if (checkUser && checkUser.estado === 2) {
            // Usuario sincronizado con estado 2, permitir acceso
            return;
          }
        }, 1000);
        return;
      }
    } else {
      // Email NO verificado, redirigir a verify-email
      if (currentUser && currentUser.estado === 3) {
        // Si ya completó perfil pero el email no está verificado (caso raro), redirigir a home
        hasRedirectedRef.current = true;
        router.push('/');
        return;
      }
      
      hasRedirectedRef.current = true;
      router.push('/register/verify-email');
      return;
    }

    // Cleanup function
    return () => {
      if (checkTimerRef.current) {
        clearTimeout(checkTimerRef.current);
        checkTimerRef.current = null;
      }
    };
  }, [user, usuarioStore, firebaseUser, token, authLoading, router]);
}

