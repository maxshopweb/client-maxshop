"use client";

import { useAuth } from "@/app/context/AuthContext";
import { User, Mail, Phone, Calendar } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { format } from "date-fns";

interface ProfileHeaderProps {
  user: IUsuario;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-card rounded-xl shadow-sm border border-input p-4 sm:p-6">
      {/* Avatar y Nombre */}
      <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-input">
        <div className="relative mb-4">
          {user.img ? (
            <img
              src={user.img}
              alt={user.nombre}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-principal/20"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-principal/10 flex items-center justify-center border-4 border-principal/20">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-principal" />
            </div>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
          {user.nombre} {user.apellido || ""}
        </h2>
        {user.username && (
          <p className="text-sm text-foreground/60 mb-2">@{user.username}</p>
        )}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-principal/10 text-principal text-xs sm:text-sm font-medium">
          {user.rol === "ADMIN" ? "Administrador" : "Cliente"}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3 text-sm sm:text-base">
          <div className="p-2 bg-background rounded-lg">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-foreground/50 mb-0.5">Email</p>
            <p className="text-foreground truncate">{user.email}</p>
          </div>
        </div>

        {user.telefono && (
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <div className="p-2 bg-background rounded-lg">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground/50 mb-0.5">Teléfono</p>
              <p className="text-foreground">{user.telefono}</p>
            </div>
          </div>
        )}

        {user.nacimiento && (
          <div className="flex items-center gap-3 text-sm sm:text-base">
            <div className="p-2 bg-background rounded-lg">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/60" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground/50 mb-0.5">Fecha de nacimiento</p>
              <p className="text-foreground">
                {format(new Date(user.nacimiento), "dd/MM/yyyy")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Botón de cerrar sesión */}
      <div className="mt-6 pt-6 border-t border-input">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors text-sm sm:text-base"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

