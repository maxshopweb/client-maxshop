"use client";

import { Suspense } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AdminProfileHeader from "@/app/components/Admin/AdminProfileHeader";
import AdminProfileInfo from "@/app/components/Admin/AdminProfileInfo";
import AdminProfileHeaderSkeleton from "@/app/components/Admin/AdminProfileHeaderSkeleton";
import AdminProfileInfoSkeleton from "@/app/components/Admin/AdminProfileInfoSkeleton";

// Componente que renderiza el contenido cuando el usuario está autenticado
function AdminProfileContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-1 space-y-6">
          <AdminProfileHeaderSkeleton />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <AdminProfileInfoSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Columna izquierda - Perfil */}
      <div className="lg:col-span-1 space-y-6">
        <Suspense fallback={<AdminProfileHeaderSkeleton />}>
          <AdminProfileHeader user={user} />
        </Suspense>
      </div>

      {/* Columna derecha - Información */}
      <div className="lg:col-span-2 space-y-6">
        <Suspense fallback={<AdminProfileInfoSkeleton />}>
          <AdminProfileInfo user={user} />
        </Suspense>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  const { loading, user } = useAuth();

  // Mientras carga, mostrar skeleton
  // El AuthGuard del layout ya maneja la validación de autenticación y rol
  if (loading || !user) {
    return (
      <div className="min-h-screen py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mi Perfil
          </h1>
          <p className="text-sm sm:text-base text-foreground/70">
            Información de tu cuenta de administrador
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <AdminProfileHeaderSkeleton />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <AdminProfileInfoSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 sm:py-8">
      {/* Header de la página */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
          Mi Perfil
        </h1>
        <p className="text-sm sm:text-base text-foreground/70">
          Información de tu cuenta de administrador
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1 space-y-6">
              <AdminProfileHeaderSkeleton />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <AdminProfileInfoSkeleton />
            </div>
          </div>
        }
      >
        <AdminProfileContent />
      </Suspense>
    </div>
  );
}

