# Guía de Autenticación y Protección de Rutas en Next.js

Esta guía explica cómo funciona el sistema de autenticación y protección de rutas implementado en el proyecto.

## 📋 Tabla de Contenidos

1. [Arquitectura](#arquitectura)
2. [Componentes Principales](#componentes-principales)
3. [Cómo Usar](#cómo-usar)
4. [Configuración de Rutas](#configuración-de-rutas)
5. [Mejores Prácticas](#mejores-prácticas)

## 🏗️ Arquitectura

El sistema utiliza una **arquitectura de múltiples capas** para proteger las rutas:

### 1. **Next.js Middleware** (Cap'a más externa)
- Se ejecuta en el **Edge Runtime** antes de renderizar cualquier página
- Verifica autenticación y roles leyendo cookies
- Redirige automáticamente si el usuario no tiene permisos
- **Ventaja**: Protección a nivel de servidor, mejor rendimiento, mejor UX

### 2. **AuthGuard Component** (Capa intermedia)
- Componente React que protege componentes y layouts
- Verifica autenticación y roles usando el contexto
- Maneja estados de carga y errores
- **Ventaja**: Protección a nivel de componente, más flexible

### 3. **AuthContext + Hooks** (Capa interna)
- Contexto de React para manejar el estado de autenticación
- Hooks personalizados para acceder al estado de auth
- Sincroniza con cookies para el middleware
- **Ventaja**: Acceso al estado de autenticación en cualquier componente

## 🧩 Componentes Principales

### 1. Middleware (`src/middleware.ts`)

El middleware se ejecuta antes de cada request y protege las rutas a nivel de servidor.

**Características:**
- ✅ Se ejecuta en el Edge Runtime (rápido)
- ✅ Lee cookies para verificar autenticación
- ✅ Redirige automáticamente si no hay permisos
- ✅ No renderiza la página si no hay acceso

**Configuración:**
```typescript
// En src/middleware.ts
const routeConfig = {
  public: ['/login', '/register'],
  authOnly: ['/login', '/register'],
  protected: {
    '/admin': ['ADMIN'],
    '/admin/home': ['ADMIN'],
  },
  authenticated: ['/cliente', '/profile'],
};
```

### 2. AuthGuard Component (`src/app/components/auth/AuthGuard.tsx`)

Componente que protege componentes y layouts a nivel de React.

**Uso:**
```tsx
<AuthGuard
  roles={['ADMIN']}
  redirectTo="/login"
  redirectUnauthorizedTo="/unauthorized"
  loadingFallback={<LoadingSpinner />}
  unauthorizedFallback={<UnauthorizedMessage />}
>
  <ProtectedContent />
</AuthGuard>
```

### 3. AuthContext (`src/app/context/AuthContext.tsx`)

Contexto de React que maneja el estado de autenticación.

**Uso:**
```tsx
const { user, role, isAuthenticated, loading, login, logout } = useAuth();
```

### 4. useAuthGuard Hook (`src/app/hooks/useAuthGuard.ts`)

Hook personalizado para verificar autenticación y roles.

**Uso:**
```tsx
const { loading, isAuthenticated, isAuthorized, role } = useAuthGuard({
  roles: ['ADMIN'],
  redirectTo: '/login',
});
```

### 5. Cookies Utils (`src/app/utils/cookies.ts`)

Utilidades para manejar cookies (necesarias para el middleware).

**Funciones:**
- `setAuthToken(token)` - Guarda el token en cookies
- `setUserRole(role)` - Guarda el rol en cookies
- `getAuthToken()` - Obtiene el token de las cookies
- `getUserRole()` - Obtiene el rol de las cookies
- `clearAuthCookies()` - Elimina las cookies de autenticación

## 🚀 Cómo Usar

### Proteger una Ruta con Middleware

1. **Agregar la ruta a la configuración del middleware:**
```typescript
// En src/middleware.ts
protected: {
  '/admin': ['ADMIN'],
  '/admin/productos': ['ADMIN'],
},
```

2. **El middleware protegerá automáticamente la ruta**
- Si el usuario no está autenticado → redirige a `/login`
- Si el usuario no tiene el rol necesario → redirige a `/unauthorized`

### Proteger un Layout con AuthGuard

```tsx
// En src/app/(routes)/(admin)/layout.tsx
import { AuthGuard } from '@/app/components/auth/AuthGuard';

export default function AdminLayout({ children }) {
  return (
    <AuthGuard
      roles={['ADMIN']}
      redirectTo="/login"
      redirectUnauthorizedTo="/unauthorized"
      loadingFallback={<LoadingSpinner />}
    >
      <div>
        {/* Contenido protegido */}
        {children}
      </div>
    </AuthGuard>
  );
}
```

### Proteger un Componente con useAuthGuard

```tsx
// En cualquier componente
import { useAuthGuard } from '@/app/hooks/useAuthGuard';

export default function ProtectedComponent() {
  const { loading, isAuthenticated, isAuthorized } = useAuthGuard({
    roles: ['ADMIN'],
    redirectTo: '/login',
  });

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated || !isAuthorized) return null;

  return <div>Contenido protegido</div>;
}
```

### Acceder al Estado de Autenticación

```tsx
// En cualquier componente
import { useAuth } from '@/app/context/AuthContext';

export default function MyComponent() {
  const { user, role, isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginPrompt />;

  return (
    <div>
      <p>Usuario: {user?.nombre}</p>
      <p>Rol: {role}</p>
    </div>
  );
}
```

## ⚙️ Configuración de Rutas

### Rutas Públicas

Rutas que no requieren autenticación:
```typescript
public: ['/login', '/register', '/forgot-password']
```

### Rutas de Autenticación

Rutas que solo son accesibles si NO estás autenticado:
```typescript
authOnly: ['/login', '/register', '/forgot-password']
```
- Si el usuario está autenticado y trata de acceder → redirige a la página principal

### Rutas Protegidas por Rol

Rutas que requieren un rol específico:
```typescript
protected: {
  '/admin': ['ADMIN'],
  '/admin/home': ['ADMIN'],
  '/admin/productos': ['ADMIN'],
}
```

### Rutas Autenticadas

Rutas que requieren autenticación pero cualquier rol puede acceder:
```typescript
authenticated: ['/cliente', '/profile', '/dashboard']
```

## 📝 Mejores Prácticas

### 1. **Usar Middleware para Protección Principal**
- ✅ El middleware es la mejor opción para proteger rutas
- ✅ Se ejecuta antes de renderizar, mejor rendimiento
- ✅ Mejor UX (no muestra contenido protegido)

### 2. **Usar AuthGuard como Fallback**
- ✅ Usar AuthGuard en layouts como capa adicional de seguridad
- ✅ Útil para manejar estados de carga y errores
- ✅ Proporciona feedback visual al usuario

### 3. **Usar Context/Hooks para Estado**
- ✅ Usar `useAuth()` para acceder al estado de autenticación
- ✅ Usar `useAuthGuard()` para verificar permisos en componentes
- ✅ No usar directamente el store de Zustand en componentes

### 4. **Sincronizar Cookies**
- ✅ El AuthContext sincroniza automáticamente las cookies
- ✅ Las cookies son necesarias para que el middleware funcione
- ✅ No modificar las cookies manualmente

### 5. **Manejar Errores**
- ✅ Crear páginas de error (como `/unauthorized`)
- ✅ Mostrar mensajes claros al usuario
- ✅ Registrar errores para debugging

## 🔒 Seguridad

### Cookies
- Las cookies se configuran con `SameSite=Lax` para seguridad
- En producción, las cookies usan `Secure` flag (HTTPS)
- Las cookies expiran después de 7 días

### Tokens
- Los tokens de Firebase se almacenan en cookies
- Los tokens se envían automáticamente en las peticiones HTTP
- Los tokens se refrescan automáticamente cuando es necesario

### Validación
- El middleware valida el token antes de renderizar
- El backend valida el token en cada petición
- Los tokens expirados se refrescan automáticamente

## 🐛 Troubleshooting

### El middleware no funciona
1. Verifica que el middleware esté en `src/middleware.ts`
2. Verifica que las cookies se estén guardando correctamente
3. Verifica la configuración de rutas en el middleware

### Las cookies no se guardan
1. Verifica que `syncAuthCookies()` se llame después de login
2. Verifica que las cookies se configuren correctamente
3. Verifica que el navegador permita cookies

### Redirecciones infinitas
1. Verifica que las rutas públicas estén configuradas correctamente
2. Verifica que el middleware no redirija a rutas protegidas
3. Verifica que las cookies se estén leyendo correctamente

## 📚 Referencias

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

