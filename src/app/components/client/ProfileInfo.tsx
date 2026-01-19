"use client";

import ProfileCard from "./ProfileCard";
import { User, Mail, Phone, Calendar, Edit } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { format } from "date-fns";
import { useDisabledStyles } from "@/app/hooks/useDisabledStyles";

interface ProfileInfoProps {
  user: IUsuario;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const {
    fieldContainerStyles,
    labelStyles,
    textStyles,
    getIconStyles,
    getTextStyles,
  } = useDisabledStyles(true);
  return (
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

      {/* Botón de editar (por ahora deshabilitado) */}
      <div className="pt-4 border-t border-input mt-4">
        <button
          disabled
          className="w-full sm:w-auto px-4 py-2.5 bg-principal/10 hover:bg-principal/20 text-principal rounded-lg font-medium transition-colors text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit className="w-4 h-4" />
          Editar información
        </button>
      </div>
    </ProfileCard>
  );
}

