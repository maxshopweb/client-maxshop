/* eslint-disable no-console */
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { type UserRole } from '../types/user';

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
  const { role, isAuthenticated, loading } = useAuth();

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
    if (loading || skipRedirect) {
      return;
    }

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (!isAuthorized) {
      router.replace(redirectUnauthorizedTo ?? redirectTo);
    }
  }, [isAuthenticated, isAuthorized, loading, redirectTo, redirectUnauthorizedTo, router, skipRedirect]);

  return {
    loading,
    isAuthenticated,
    isAuthorized,
    role
  };
};

