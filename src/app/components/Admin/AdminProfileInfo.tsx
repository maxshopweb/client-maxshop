"use client";

import ProfileCard from "../client/ProfileCard";
import { User, Mail, Phone, Calendar, Shield } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { format } from "date-fns";
import { useDisabledStyles } from "@/app/hooks/useDisabledStyles";

interface AdminProfileInfoProps {
  user: IUsuario;
}

export default function AdminProfileInfo({ user }: AdminProfileInfoProps) {
  const {
    isDisabled,
    fieldContainerStyles,
    labelStyles,
    textStyles,
    getIconStyles,
    getTextStyles,
  } = useDisabledStyles(true);

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
    <div className="space-y-6">
      {/* Información personal */}
      <ProfileCard title="Información personal" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Nombre */}
          <div>
            <label className={labelStyles}>
              Nombre
            </label>
            <div className={fieldContainerStyles}>
              <User className={getIconStyles()} />
              <span className={textStyles}>
                {user.nombre}
              </span>
            </div>
          </div>

          {/* Apellido */}
          <div>
            <label className={labelStyles}>
              Apellido
            </label>
            <div className={fieldContainerStyles}>
              <User className={getIconStyles()} />
              <span className={textStyles}>
                {user.apellido || "No especificado"}
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelStyles}>
              Email
            </label>
            <div className={fieldContainerStyles}>
              <Mail className={getIconStyles()} />
              <span className={getTextStyles("truncate")}>
                {user.email}
              </span>
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className={labelStyles}>
              Teléfono
            </label>
            <div className={fieldContainerStyles}>
              <Phone className={getIconStyles()} />
              <span className={textStyles}>
                {user.telefono || "No especificado"}
              </span>
            </div>
          </div>

          {/* Username */}
          {user.username && (
            <div>
              <label className={labelStyles}>
                Username
              </label>
              <div className={fieldContainerStyles}>
                <User className={getIconStyles()} />
                <span className={textStyles}>
                  @{user.username}
                </span>
              </div>
            </div>
          )}

          {/* Fecha de nacimiento */}
          {user.nacimiento && (
            <div>
              <label className={labelStyles}>
                Fecha de nacimiento
              </label>
              <div className={fieldContainerStyles}>
                <Calendar className={getIconStyles()} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Rol */}
          <div>
            <label className={labelStyles}>
              Rol
            </label>
            <div className={fieldContainerStyles}>
              <Shield className={getIconStyles(
                isDisabled ? "text-principal/40" : "text-principal"
              )} />
              <span className={textStyles}>
                {user.rol === "ADMIN" ? "Administrador" : "Usuario"}
              </span>
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className={labelStyles}>
              Estado
            </label>
            <div className={fieldContainerStyles}>
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 transition-opacity ${
                  isDisabled ? "opacity-50" : ""
                } ${
                  user.estado === 1
                    ? "bg-green-500"
                    : user.estado === 2
                    ? "bg-yellow-500"
                    : user.estado === 0
                    ? "bg-red-500"
                    : "bg-blue-500"
                }`}
              />
              <span className={textStyles}>
                {getEstadoLabel(user.estado)}
              </span>
            </div>
          </div>

          {/* UID */}
          <div className="sm:col-span-2">
            <label className={labelStyles}>
              ID de usuario
            </label>
            <div className={fieldContainerStyles}>
              <span className={getTextStyles(
                `text-xs sm:text-sm font-mono ${isDisabled ? "text-foreground/40" : "text-foreground/60"}`
              )}>
                {user.uid}
              </span>
            </div>
          </div>
        </div>
      </ProfileCard>
    </div>
  );
}

