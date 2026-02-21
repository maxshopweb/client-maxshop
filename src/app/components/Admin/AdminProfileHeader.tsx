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
    <div className="bg-card rounded-xl border border-border/50 p-4 sm:p-6">
      {/* Avatar y Nombre */}
      <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-border/40">
        <div className="relative mb-4">
          {user.img ? (
            <img
              src={user.img}
              alt={user.nombre}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-muted flex items-center justify-center">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-foreground/25" />
            </div>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-medium text-foreground mb-0.5">
          {user.nombre} {user.apellido || ""}
        </h2>
        {user.username && (
          <p className="text-xs text-foreground/40 mb-3">@{user.username}</p>
        )}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-border/50 text-foreground/50 text-xs">
            <Shield className="w-3 h-3" />
            Administrador
          </span>
          {user.estado !== undefined && user.estado !== null && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border border-border/50 text-foreground/40 text-xs">
              {getEstadoLabel(user.estado)}
            </span>
          )}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/35 mb-1.5">Email</p>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/30 bg-muted/30">
            <Mail className="w-3.5 h-3.5 text-foreground/25 shrink-0" />
            <span className="text-sm text-foreground/50 truncate">{user.email}</span>
          </div>
        </div>

        {user.telefono && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/35 mb-1.5">Teléfono</p>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/30 bg-muted/30">
              <Phone className="w-3.5 h-3.5 text-foreground/25 shrink-0" />
              <span className="text-sm text-foreground/50">{user.telefono}</span>
            </div>
          </div>
        )}

        {user.nacimiento && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/35 mb-1.5">Nacimiento</p>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border/30 bg-muted/30">
              <Calendar className="w-3.5 h-3.5 text-foreground/25 shrink-0" />
              <span className="text-sm text-foreground/50">
                {format(new Date(user.nacimiento), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

