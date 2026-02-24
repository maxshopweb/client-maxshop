"use client";

import ProfileCard from "../client/ProfileCard";
import { User, Mail, Phone, Calendar, Shield, Lock } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { format } from "date-fns";
import { useDisabledStyles } from "@/app/hooks/useDisabledStyles";
import { Badge } from "@/app/components/ui/Badge";

interface AdminProfileInfoProps {
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

export default function AdminProfileInfo({ user }: AdminProfileInfoProps) {
  const {
    fieldContainerStyles,
    labelStyles,
    textStyles,
    getIconStyles,
    getTextStyles,
    readOnlyHint,
  } = useDisabledStyles(true);

  return (
    <div className="space-y-6">
      {/* Información personal */}
      <ProfileCard title="Información personal" icon={User}>
        <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/45 mb-4">
          <Lock className="w-3 h-3" />
          {readOnlyHint}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={labelStyles}>Nombre</label>
            <div className={fieldContainerStyles}>
              <User className={getIconStyles("text-principal/50")} />
              <span className={textStyles}>{user.nombre}</span>
            </div>
          </div>

          <div>
            <label className={labelStyles}>Apellido</label>
            <div className={fieldContainerStyles}>
              <User className={getIconStyles("text-principal/50")} />
              <span className={textStyles}>{user.apellido || "No especificado"}</span>
            </div>
          </div>

          <div>
            <label className={labelStyles}>Email</label>
            <div className={fieldContainerStyles}>
              <Mail className={getIconStyles("text-principal/50")} />
              <span className={getTextStyles("truncate")}>{user.email}</span>
            </div>
          </div>

          <div>
            <label className={labelStyles}>Teléfono</label>
            <div className={fieldContainerStyles}>
              <Phone className={getIconStyles("text-principal/50")} />
              <span className={textStyles}>{user.telefono || "No especificado"}</span>
            </div>
          </div>

          {user.username && (
            <div>
              <label className={labelStyles}>Username</label>
              <div className={fieldContainerStyles}>
                <User className={getIconStyles("text-principal/50")} />
                <span className={textStyles}>@{user.username}</span>
              </div>
            </div>
          )}

          {user.nacimiento && (
            <div>
              <label className={labelStyles}>Fecha de nacimiento</label>
              <div className={fieldContainerStyles}>
                <Calendar className={getIconStyles("text-principal/50")} />
                <span className={textStyles}>
                  {format(new Date(user.nacimiento), "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          )}
        </div>
      </ProfileCard>

      {/* Información de cuenta */}
      <ProfileCard title="Información de cuenta" icon={Shield}>
        <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-foreground/45 mb-4">
          <Lock className="w-3 h-3" />
          {readOnlyHint}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className={labelStyles}>Rol</label>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant={user.rol === "ADMIN" ? "info" : "neutral"} className="gap-1">
                <Shield className="w-3 h-3" />
                {user.rol === "ADMIN" ? "Administrador" : "Usuario"}
              </Badge>
            </div>
          </div>

          <div>
            <label className={labelStyles}>Estado</label>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant={getEstadoBadgeVariant(user.estado)}>
                {getEstadoLabel(user.estado)}
              </Badge>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={labelStyles}>ID de usuario</label>
            <div className={fieldContainerStyles}>
              <span className={getTextStyles("text-xs sm:text-sm font-mono text-foreground/65")}>
                {user.uid}
              </span>
            </div>
          </div>
        </div>
      </ProfileCard>
    </div>
  );
}

