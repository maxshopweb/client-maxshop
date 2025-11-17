'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useAuthStore } from '@/app/stores/userStore';
import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'sonner';
import { completeProfileSchema } from '@/app/schemas/auth.schema';
import { User, Phone, Calendar } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/app/lib/firebase.config';

export default function CompletePerfilPage() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [nacimiento, setNacimiento] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    nombre?: string;
    apellido?: string;
    telefono?: string;
    nacimiento?: string;
  }>({});
  const { completeProfile, user, role, firebaseUser, loading: authLoading } = useAuth();
  const usuarioStore = useAuthStore((state) => state.usuario);
  const router = useRouter();

  // Proteger ruta: requiere autenticación y estado 2
  useEffect(() => {
    // Esperar a que termine la carga inicial
    if (authLoading) return;

    // Usar el usuario del store o del contexto (el store se actualiza más rápido)
    const currentUser = usuarioStore || user;
    const currentFirebaseUser = firebaseUser || auth.currentUser;
    const token = useAuthStore.getState().token;

    // Si hay token pero no hay usuario todavía, esperar un poco más (puede estar sincronizando)
    if (token && !currentUser && !currentFirebaseUser) {
      const timer = setTimeout(() => {
        const checkStore = useAuthStore.getState().usuario;
        const checkFirebase = auth.currentUser;
        if (!checkStore && !checkFirebase && !authLoading) {
          toast.error('No hay usuario autenticado. Por favor, inicia sesión nuevamente.');
          router.push('/login');
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Si no hay token ni usuario, redirigir a login
    if (!token && !currentUser && !currentFirebaseUser) {
      toast.error('Debes estar autenticado para completar tu perfil');
      router.push('/login');
      return;
    }

    // Si hay firebaseUser pero no user del backend, esperar un poco más
    if (currentFirebaseUser && !currentUser) {
      const timer = setTimeout(() => {
        const checkStore = useAuthStore.getState().usuario;
        if (!checkStore && !authLoading) {
          // Si hay token, el usuario debería estar sincronizando, no redirigir todavía
          const hasToken = useAuthStore.getState().token;
          if (!hasToken) {
            toast.error('No se pudo obtener la información del usuario');
            router.push('/login');
          }
        }
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Si no hay firebaseUser pero hay token y usuario en store, está bien (puede estar sincronizando)
    if (!currentFirebaseUser && token && currentUser) {
      // Esperar a que Firebase se sincronice
      return;
    }

    // Verificar email verificado solo si hay firebaseUser
    if (currentFirebaseUser && !currentFirebaseUser.emailVerified) {
      toast.error('Debes verificar tu email antes de completar tu perfil');
      router.push('/register/verify-email');
      return;
    }

    // Si el estado no es 2, redirigir según el rol (estado 3 = perfil completo)
    if (currentUser) {
      const currentEstado = currentUser.estado;
      if (currentEstado === 3) {
        // Perfil completo, redirigir inmediatamente
        const currentRole = role || currentUser.rol;
        if (currentRole === 'ADMIN') {
          router.replace('/admin/home');
        } else {
          router.replace('/');
        }
        return;
      }
      // Si el estado es null o diferente de 2 y 3, también redirigir
      if (currentEstado !== 2 && currentEstado !== null) {
        const currentRole = role || currentUser.rol;
        if (currentRole === 'ADMIN') {
          router.replace('/admin/home');
        } else {
          router.replace('/');
        }
        return;
      }
    }
  }, [firebaseUser, user, usuarioStore, role, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validationResult = completeProfileSchema.safeParse({
        nombre,
        apellido: apellido || null,
        telefono: telefono || null,
        nacimiento: nacimiento || null,
      });

      if (!validationResult.success) {
        const fieldErrors: typeof errors = {};
        validationResult.error.issues.forEach((err) => {
          const path = err.path[0] as keyof typeof fieldErrors;
          if (path) fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      const result = await completeProfile({
        nombre: validationResult.data.nombre,
        apellido: validationResult.data.apellido ?? null,
        telefono: validationResult.data.telefono ?? undefined,
        nacimiento: validationResult.data.nacimiento ? new Date(validationResult.data.nacimiento) : undefined,
      });

      if (result.success) {
        toast.success(result.message || '¡Perfil completado exitosamente!');
        
        // Esperar un momento para que el store se actualice
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Obtener el estado actualizado del store
        const updatedUser = useAuthStore.getState().usuario;
        const updatedRole = updatedUser?.rol || role;
        
        // Redirigir según el rol usando replace para evitar que vuelva atrás
        if (updatedRole === 'ADMIN') {
          router.replace('/admin/home');
        } else {
          router.replace('/');
        }
      } else {
        toast.error(result.message || 'Error al completar el perfil');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Error al completar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Completar perfil" subtitle="Terminemos de configurar tu cuenta">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="nombre"
            type="text"
            label="Nombre *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Juan"
            required
            disabled={loading}
            error={errors.nombre}
            icon={User}
          />

          <Input
            id="apellido"
            type="text"
            label="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Pérez"
            disabled={loading}
            error={errors.apellido}
            icon={User}
          />

          <Input
            id="telefono"
            type="tel"
            label="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+54 9 11 1234-5678"
            disabled={loading}
            error={errors.telefono}
            icon={Phone}
          />

          <Input
            id="nacimiento"
            type="date"
            label="Fecha de nacimiento"
            value={nacimiento}
            onChange={(e) => setNacimiento(e.target.value)}
            disabled={loading}
            error={errors.nacimiento}
            icon={Calendar}
          />

          <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
            {loading ? 'Completando perfil...' : 'Completar perfil'}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-xs">
          Los campos marcados con * son obligatorios. Podrás actualizar esta información más tarde.
        </p>
      </div>

      <p className="text-center text-gray-600 text-sm pt-2">
        <button
          onClick={() => {
            const currentUser = useAuthStore.getState().usuario;
            const currentRole = currentUser?.rol || role;
            if (currentUser?.estado === 3) {
              // Si el perfil está completo, ir a home
              router.replace(currentRole === 'ADMIN' ? '/admin/home' : '/');
            } else {
              // Si no está completo, ir a login
              router.replace('/login');
            }
          }}
          className="text-orange-600 hover:text-orange-700 font-semibold"
        >
          Volver al inicio
        </button>
      </p>
    </AuthLayout>
  );
}
