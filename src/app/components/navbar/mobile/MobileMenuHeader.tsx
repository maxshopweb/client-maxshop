"use client";

import Link from "next/link";
import { User, X } from "lucide-react";

interface MobileMenuHeaderProps {
  isAuthenticated: boolean;
  user?: {
    nombre?: string;
    username?: string;
  } | null;
  loginUrl: string;
  onClose: () => void;
  onLoginClick: () => void;
}

export default function MobileMenuHeader({
  isAuthenticated,
  user,
  loginUrl,
  onClose,
  onLoginClick,
}: MobileMenuHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/20">
      <div className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user.nombre || user.username || 'Usuario'}
              </p>
            </div>
          </div>
        ) : (
          <Link
            href={loginUrl}
            onClick={onLoginClick}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <User size={20} />
            <span className="text-sm">Inicia Sesión / Regístrate</span>
          </Link>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
      >
        <X size={24} className="text-white" />
      </button>
    </div>
  );
}

