'use client';

import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { User, Phone, Calendar } from 'lucide-react';
import { useHandleCompletePerfil } from '@/app/hooks/auth/useHandleCompletePerfil';
import { useCompletePerfilGuard } from '@/app/hooks/auth/useCompletePerfilGuard';

export default function CompletePerfilPage() {
  // Hook que maneja toda la lógica del guard y redirecciones
  useCompletePerfilGuard();

  const { nombre, apellido, telefono, loading, errors, handleSubmit, setFieldValue, nacimiento, handleBackLogin } = useHandleCompletePerfil();

  return (
    <AuthLayout title="Completar perfil" subtitle="Terminemos de configurar tu cuenta">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="nombre"
            type="text"
            label="Nombre *"
            value={nombre}
            onChange={(e) => setFieldValue('nombre', e.target.value)}
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
            onChange={(e) => setFieldValue('apellido', e.target.value)}
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
            onChange={(e) => setFieldValue('telefono', e.target.value)}
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
            onChange={(e) => setFieldValue('nacimiento', e.target.value)}
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

      <p className="text-center text-gray-600 text-sm py-2">
        <button
          onClick={handleBackLogin}
          className="text-orange-600 hover:text-orange-700 font-semibold"
        >
          Volver al login
        </button>
      </p>
    </AuthLayout>
  );
}
