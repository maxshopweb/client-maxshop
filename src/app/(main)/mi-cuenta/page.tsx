"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import OrdersSection from "./components/OrdersSection";
import ProfileHeaderSkeleton from "./components/ProfileHeaderSkeleton";
import ProfileInfoSkeleton from "./components/ProfileInfoSkeleton";
import OrdersSectionSkeleton from "./components/OrdersSectionSkeleton";

// Componente que renderiza el contenido cuando el usuario está autenticado
function MiCuentaContent() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Columna izquierda - Perfil */}
      <div className="lg:col-span-1 space-y-6">
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeader user={user} />
        </Suspense>
      </div>

      {/* Columna derecha - Información y Pedidos */}
      <div className="lg:col-span-2 space-y-6">
        <Suspense fallback={<ProfileInfoSkeleton />}>
          <ProfileInfo user={user} />
        </Suspense>
        <Suspense fallback={<OrdersSectionSkeleton />}>
          <OrdersSection />
        </Suspense>
      </div>
    </div>
  );
}

export default function MiCuentaPage() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  // Mostrar skeletons mientras carga la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-background py-6 sm:py-8 md:py-12 mt-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header de la página */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              Mi Cuenta
            </h1>
            <p className="text-sm sm:text-base text-foreground/70">
              Gestiona tu información personal y revisa tus pedidos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-1 space-y-6">
              <ProfileHeaderSkeleton />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <ProfileInfoSkeleton />
              <OrdersSectionSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // El useEffect redirigirá
  }

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 md:py-12 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header de la página */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            Mi Cuenta
          </h1>
          <p className="text-sm sm:text-base text-foreground/70">
            Gestiona tu información personal y revisa tus pedidos
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-1 space-y-6">
                <ProfileHeaderSkeleton />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <ProfileInfoSkeleton />
                <OrdersSectionSkeleton />
              </div>
            </div>
          }
        >
          <MiCuentaContent />
        </Suspense>
      </div>
    </div>
  );
}

