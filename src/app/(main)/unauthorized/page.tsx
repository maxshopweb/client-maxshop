'use client';

import { Button } from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUserRole, getAuthToken } from '@/app/utils/cookies';

export default function UnauthorizedPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Leer el rol y token directamente de las cookies (más rápido que esperar al AuthContext)
    const userRole = getUserRole();
    const authToken = getAuthToken();
    
    setRole(userRole);
    setToken(authToken);

    // Si no hay token, redirigir a login
    if (!authToken) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center px-4">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-terciario mb-4">
          Acceso denegado
        </h1>
        
        <p className="text-lg text-terciario/70 mb-8 max-w-md mx-auto">
          No tienes permisos para acceder a esta sección. 
          {role && (
            <span className="block mt-2 text-sm">
              Tu rol actual: <span className="font-semibold text-terciario">{role}</span>
            </span>
          )}
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button
            variant="primary"
            onClick={() => router.back()}
          >
            Volver
          </Button>
          
          <Button
            variant="outline-primary"
            onClick={() => router.push('/')}
          >
            Ir al inicio
          </Button>
        </div>
        
        {role === 'ADMIN' && (
          <p className="mt-8 text-sm text-terciario/60">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        )}
      </div>
    </div>
  );
}

