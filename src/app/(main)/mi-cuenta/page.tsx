"use client";

import { Suspense } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useAuthStore } from "@/app/stores/userStore";
import ProfileHeader from "../../components/client/ProfileHeader";
import ProfileInfo from "../../components/client/ProfileInfo";
import AddressesSection from "../../components/client/AddressesSection";
import OrdersSection from "../../components/client/OrdersSection";
import ProfileHeaderSkeleton from "../../components/client/ProfileHeaderSkeleton";
import ProfileInfoSkeleton from "../../components/client/ProfileInfoSkeleton";
import OrdersSectionSkeleton from "../../components/client/OrdersSectionSkeleton";
import OrdersSectionErrorBoundary from "../../components/client/OrdersSectionErrorBoundary";

// Wrapper para OrdersSection que muestra skeleton mientras carga
function OrdersSectionWrapper() {
  const { isAuthenticated, token, loading: authLoading } = useAuth();
  
  // Mostrar skeleton si está cargando la autenticación o no está autenticado aún
  if (authLoading || !isAuthenticated || !token) {
    return <OrdersSectionSkeleton />;
  }
  
  return <OrdersSection />;
}

// Componente que renderiza el contenido cuando el usuario está autenticado
function MiCuentaContent() {
  const { user } = useAuth();
  const storeUser = useAuthStore((state) => state.usuario);
  const currentUser = user || storeUser;

  if (!currentUser) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Columna izquierda - Perfil */}
      <div className="lg:col-span-1 space-y-6">
        <Suspense fallback={<ProfileHeaderSkeleton />}>
          <ProfileHeader user={currentUser} />
        </Suspense>
      </div>

      {/* Columna derecha - Información y Pedidos */}
      <div className="lg:col-span-2 space-y-6">
        <Suspense fallback={<ProfileInfoSkeleton />}>
          <ProfileInfo user={currentUser} />
        </Suspense>
        <Suspense fallback={<div className="h-64 bg-card rounded-xl animate-pulse" />}>
          <AddressesSection />
        </Suspense>
        <OrdersSectionErrorBoundary>
          <OrdersSectionWrapper />
        </OrdersSectionErrorBoundary>
      </div>
    </div>
  );
}

// Componente de layout común para evitar duplicación
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 md:py-12 mt-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header de la página */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-foreground/90 mb-2">
            Mi Cuenta
          </h1>
          <p className="text-sm sm:text-base text-foreground/70">
            Gestiona tu información personal y revisa tus pedidos
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function MiCuentaPage() {
  const { isAuthenticated, loading, user, token } = useAuth();
  // Verificar también el store directamente (más confiable durante sincronización)
  const storeUser = useAuthStore((state) => state.usuario);
  const storeToken = useAuthStore((state) => state.token);
  const storeIsAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  // Usar el usuario del store si el del contexto no está disponible (durante sincronización)
  // El store es más confiable porque persiste en localStorage
  const currentUser = storeUser || user;
  const currentToken = storeToken || token;
  const currentIsAuthenticated = storeIsAuthenticated || isAuthenticated;
  
  // // LOGS PARA DEBUGGING
  // console.log({
  //   'Contexto - loading': loading,
  //   'Contexto - isAuthenticated': isAuthenticated,
  //   'Contexto - user': user ? `${user.nombre} (${user.email})` : null,
  //   'Contexto - token': token ? `${token.substring(0, 20)}...` : null,
  //   'Store - usuario': storeUser ? `${storeUser.nombre} (${storeUser.email})` : null,
  //   'Store - token': storeToken ? `${storeToken.substring(0, 20)}...` : null,
  //   'Store - isAuthenticated': storeIsAuthenticated,
  //   'currentUser': currentUser ? `${currentUser.nombre} (${currentUser.email})` : null,
  //   'currentToken': currentToken ? `${currentToken.substring(0, 20)}...` : null,
  //   'currentIsAuthenticated': currentIsAuthenticated,
  // });
  
  // NO redirigir NUNCA - solo proteger la ruta mostrando skeleton si no está autenticado
  // Si hay usuario y token en el store, mostrar contenido incluso si el contexto está cargando
  
  // Solo mostrar skeleton si NO hay usuario en NINGUNA fuente Y ya terminó de cargar
  // Si el store tiene usuario, mostrar contenido inmediatamente (no esperar al contexto)
  const hasUserInStore = !!storeUser && !!storeToken;
  const shouldShowSkeleton = !hasUserInStore && (loading || !currentIsAuthenticated || !currentUser);
  
  // console.log({
  //   'hasUserInStore': hasUserInStore,
  //   'shouldShowSkeleton': shouldShowSkeleton,
  //   'Razón': shouldShowSkeleton 
  //     ? `Skeleton porque: ${!hasUserInStore ? 'No hay usuario en store' : ''} ${loading ? '| Contexto cargando' : ''} ${!currentIsAuthenticated ? '| No autenticado' : ''} ${!currentUser ? '| No hay usuario' : ''}`
  //     : 'Mostrando contenido'
  // });
  
  if (shouldShowSkeleton) {
    return (
      <PageLayout>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1 space-y-6">
            <ProfileHeaderSkeleton />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ProfileInfoSkeleton />
            <OrdersSectionSkeleton />
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
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
    </PageLayout>
  );
}

