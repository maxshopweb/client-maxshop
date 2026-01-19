"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export function useNavbarAuth() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const getLoginUrl = () => {
    if (pathname?.startsWith('/login') || pathname?.startsWith('/register') || pathname?.startsWith('/forgot-password')) {
      return '/login';
    }
    return `/login?redirect=${encodeURIComponent(pathname || '/')}`;
  };

  return {
    user,
    isAuthenticated,
    loginUrl: getLoginUrl(),
    logout,
  };
}

