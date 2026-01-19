'use client';

import { ReactNode } from 'react';
import { useAuthGuard } from '../../hooks/auth/useAuthGuard';
import { type UserRole } from '../../types/user';

type AuthGuardProps = {
  children: ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
  redirectUnauthorizedTo?: string;
  loadingFallback?: ReactNode;
  unauthorizedFallback?: ReactNode;
  skipRedirect?: boolean;
};

export function AuthGuard({
  children,
  roles,
  redirectTo,
  redirectUnauthorizedTo,
  loadingFallback = null,
  unauthorizedFallback = null,
  skipRedirect
}: AuthGuardProps) {
  const { loading, isAuthenticated, isAuthorized } = useAuthGuard({
    roles,
    redirectTo,
    redirectUnauthorizedTo,
    skipRedirect
  });

  if (loading) {
    return <>{loadingFallback}</>;
  }

  if (!isAuthenticated || !isAuthorized) {
    return <>{unauthorizedFallback}</>;
  }

  return <>{children}</>;
}

