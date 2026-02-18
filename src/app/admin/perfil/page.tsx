"use client";

import { Suspense } from "react";
import { useAuth } from "@/app/context/AuthContext";
import AdminProfileHeader from "@/app/components/Admin/AdminProfileHeader";
import AdminProfileInfo from "@/app/components/Admin/AdminProfileInfo";
import AdminProfileHeaderSkeleton from "@/app/components/Admin/AdminProfileHeaderSkeleton";
import AdminProfileInfoSkeleton from "@/app/components/Admin/AdminProfileInfoSkeleton";
import { AdminPageHeader } from "@/app/components/Admin/AdminPageHeader";
import { AdminPageContainer } from "@/app/components/Admin/AdminPageContainer";

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
      <AdminPageContainer>
        <AdminPageHeader
          title="Mi Perfil"
          description="Información de tu cuenta de administrador"
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <AdminProfileHeaderSkeleton />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <AdminProfileInfoSkeleton />
          </div>
        </div>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <AdminPageHeader
        title="Mi Perfil"
        description="Información de tu cuenta de administrador"
      />

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
    </AdminPageContainer>
  );
}

