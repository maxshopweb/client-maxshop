"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";

interface MobileMenuFooterProps {
  isAuthenticated: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function MobileMenuFooter({
  isAuthenticated,
  onClose,
  onLogout,
}: MobileMenuFooterProps) {
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
      <div className="space-y-2">
        <Link
          href="/cuenta"
          onClick={onClose}
          className="block py-3 px-4 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
        >
          Mi cuenta
        </Link>
        <button
          onClick={() => {
            onLogout();
            onClose();
          }}
          className="w-full flex items-center gap-2 py-3 px-4 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}

