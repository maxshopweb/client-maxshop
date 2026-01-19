/* eslint-disable no-console */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { getUserRole, getAuthToken } from '../../utils/cookies';
import { type UserRole } from '../../types/user';

type UseAuthGuardOptions = {
  roles?: UserRole[];
  redirectTo?: string;
  redirectUnauthorizedTo?: string;
  skipRedirect?: boolean;
};

export const useAuthGuard = ({
  roles,
  redirectTo = '/login',
  redirectUnauthorizedTo,
  skipRedirect = false
}: UseAuthGuardOptions = {}) => {
  const router = useRouter();
  const { role: contextRole, isAuthenticated: contextIsAuthenticated, loading } = useAuth();
  
  // Leer de cookies como fallback mientras el contexto carga
  const [cookieRole, setCookieRole] = useState<string | null>(null);
  const [cookieToken, setCookieToken] = useState<string | null>(null);

  useEffect(() => {
    // Leer de cookies inmediatamente
    const roleFromCookie = getUserRole();
    const tokenFromCookie = getAuthToken();
    setCookieRole(roleFromCookie);
    setCookieToken(tokenFromCookie);
  }, []);

  // Usar el role del contexto si está disponible, sino usar el de las cookies
  const role = contextRole || (cookieRole as UserRole | null);
  const isAuthenticated = contextIsAuthenticated || !!cookieToken;

  const isAuthorized = useMemo(() => {
    if (!roles || roles.length === 0) {
      return isAuthenticated;
    }

    if (!isAuthenticated) {
      return false;
    }

    return role ? roles.includes(role) : false;
  }, [isAuthenticated, role, roles]);

  useEffect(() => {
    // Esperar un poco más si está cargando para dar tiempo al contexto
    if (loading && !cookieToken) {
      return;
    }

    if (skipRedirect) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (!isAuthorized && role !== null) {
      // Solo redirigir si tenemos certeza del role (no es null)
      router.replace(redirectUnauthorizedTo ?? redirectTo);
    }
  }, [isAuthenticated, isAuthorized, loading, redirectTo, redirectUnauthorizedTo, router, skipRedirect, role, cookieToken]);

  return {
    loading: loading && !cookieToken, // Solo mostrar loading si no hay cookie
    isAuthenticated,
    isAuthorized,
    role
  };
};

