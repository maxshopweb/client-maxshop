"use client";

import { User, Mail, Phone, Calendar, Shield, Lock } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { format } from "date-fns";
import { Badge } from "@/app/components/ui/Badge";

interface AdminProfileHeaderProps {
  user: IUsuario;
}

function getEstadoBadgeVariant(estado?: number | null): "success" | "warning" | "error" | "neutral" | "info" {
  switch (estado) {
    case 0: return "error";
    case 1: return "success";
    case 2: return "warning";
    case 3: return "info";
    default: return "success";
  }
}

function getEstadoLabel(estado?: number | null) {
  switch (estado) {
    case 0: return "Eliminado";
    case 1: return "Activo";
    case 2: return "Inactivo";
    case 3: return "Perfil incompleto";
    default: return "Activo";
  }
}

export default function AdminProfileHeader({ user }: AdminProfileHeaderProps) {
  return (
    <div className="bg-card rounded-xl border border-outline-subtle shadow-sm p-4 sm:p-6">
      {/* Avatar y Nombre */}
      <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-outline-subtle">
        <div className="relative mb-4">
          {user.img ? (
            <img
              src={user.img}
              alt={user.nombre}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-principal/20"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-principal/15 to-principal/5 flex items-center justify-center ring-2 ring-principal/10">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-principal/70" />
            </div>
          )}
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-foreground mb-0.5">
          {user.nombre} {user.apellido || ""}
        </h2>
        {user.username && (
          <p className="text-xs text-foreground/55 mb-3">@{user.username}</p>
        )}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant={user.rol === "ADMIN" ? "info" : "neutral"} className="gap-1">
            <Shield className="w-3 h-3" />
            {user.rol === "ADMIN" ? "Administrador" : "Usuario"}
          </Badge>
          {user.estado !== undefined && user.estado !== null && (
            <Badge variant={getEstadoBadgeVariant(user.estado)}>
              {getEstadoLabel(user.estado)}
            </Badge>
          )}
        </div>
      </div>

      {/* Información de contacto - solo lectura */}
      <div className="space-y-3">
        <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/45 mb-3">
          <Lock className="w-3 h-3" />
          Solo lectura
        </p>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/50 mb-1.5">Email</p>
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-outline-subtle bg-muted/20 cursor-default">
            <Mail className="w-3.5 h-3.5 text-principal/50 shrink-0" />
            <span className="text-sm text-foreground/75 truncate">{user.email}</span>
          </div>
        </div>

        {user.telefono && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/50 mb-1.5">Teléfono</p>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-outline-subtle bg-muted/20 cursor-default">
              <Phone className="w-3.5 h-3.5 text-principal/50 shrink-0" />
              <span className="text-sm text-foreground/75">{user.telefono}</span>
            </div>
          </div>
        )}

        {user.nacimiento && (
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground/50 mb-1.5">Nacimiento</p>
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-outline-subtle bg-muted/20 cursor-default">
              <Calendar className="w-3.5 h-3.5 text-principal/50 shrink-0" />
              <span className="text-sm text-foreground/75">
                {format(new Date(user.nacimiento), "dd/MM/yyyy")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

