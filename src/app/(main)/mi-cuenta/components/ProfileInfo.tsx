"use client";

import ProfileCard from "./ProfileCard";
import { User, Mail, Phone, Calendar, Edit } from "lucide-react";
import type { IUsuario } from "@/app/types/user";
import { format } from "date-fns";

interface ProfileInfoProps {
  user: IUsuario;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <ProfileCard title="Información personal" icon={User}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground/70 mb-1.5">
            Nombre
          </label>
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <User className="w-4 h-4 text-foreground/40 flex-shrink-0" />
            <span className="text-sm sm:text-base text-foreground">
              {user.nombre}
            </span>
          </div>
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground/70 mb-1.5">
            Apellido
          </label>
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <User className="w-4 h-4 text-foreground/40 flex-shrink-0" />
            <span className="text-sm sm:text-base text-foreground">
              {user.apellido || "No especificado"}
            </span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground/70 mb-1.5">
            Email
          </label>
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Mail className="w-4 h-4 text-foreground/40 flex-shrink-0" />
            <span className="text-sm sm:text-base text-foreground truncate">
              {user.email}
            </span>
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-foreground/70 mb-1.5">
            Teléfono
          </label>
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
            <Phone className="w-4 h-4 text-foreground/40 flex-shrink-0" />
            <span className="text-sm sm:text-base text-foreground">
              {user.telefono || "No especificado"}
            </span>
          </div>
        </div>

        {/* Username */}
        {user.username && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground/70 mb-1.5">
              Username
            </label>
            <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
              <User className="w-4 h-4 text-foreground/40 flex-shrink-0" />
              <span className="text-sm sm:text-base text-foreground">
                @{user.username}
              </span>
            </div>
          </div>
        )}

        {/* Fecha de nacimiento */}
        {user.nacimiento && (
          <div>
            <label className="block text-xs sm:text-sm font-medium text-foreground/70 mb-1.5">
              Fecha de nacimiento
            </label>
            <div className="flex items-center gap-2 p-3 bg-background rounded-lg border border-input">
              <Calendar className="w-4 h-4 text-foreground/40 flex-shrink-0" />
              <span className="text-sm sm:text-base text-foreground">
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

