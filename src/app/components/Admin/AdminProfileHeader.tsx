"use client";

import { User, Mail, Phone, Calendar, Shield } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { format } from "date-fns";

interface AdminProfileHeaderProps {
  user: IUsuario;
}

export default function AdminProfileHeader({ user }: AdminProfileHeaderProps) {
  const getEstadoLabel = (estado?: number | null) => {
    switch (estado) {
      case 0:
        return "Eliminado";
      case 1:
        return "Activo";
      case 2:
        return "Inactivo";
      case 3:
        return "Perfil incompleto";
      default:
        return "Activo";
    }
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
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-principal/10 text-principal text-xs sm:text-sm font-medium">
            <Shield className="w-3 h-3 mr-1" />
            Administrador
          </div>
          {user.estado !== undefined && user.estado !== null && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-background text-foreground/70 text-xs sm:text-sm font-medium border border-input">
              {getEstadoLabel(user.estado)}
            </div>
          )}
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
    </div>
  );
}

