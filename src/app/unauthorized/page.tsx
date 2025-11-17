'use client';

import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function UnauthorizedPage() {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si el usuario no está autenticado, redirigir a login
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
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
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Acceso Denegado
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          No tienes permisos para acceder a esta sección. 
          {role && (
            <span className="block mt-2 text-sm">
              Tu rol actual: <span className="font-semibold">{role}</span>
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
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
            Si crees que esto es un error, contacta al administrador del sistema.
          </p>
        )}
      </div>
    </div>
  );
}

