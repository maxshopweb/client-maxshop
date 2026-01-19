'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import AuthLayout from '@/app/components/layouts/authLayout';
import { useResetPassword } from '@/app/hooks/auth/useResetPassword';
import { ResetPasswordForm } from '@/app/components/auth/ResetPasswordForm';
import { ResetPasswordSuccess } from '@/app/components/auth/ResetPasswordSuccess';
import { ResetPasswordInvalidLink } from '@/app/components/auth/ResetPasswordInvalidLink';

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function ResetPasswordContent() {
  const {
    password,
    confirmPassword,
    loading,
    success,
    errors,
    oobCode,
    handleSubmit,
    handlePasswordChange,
    handleConfirmPasswordChange
  } = useResetPassword();

  if (success) {
    return (
      <AuthLayout
        title="Contraseña restablecida"
        subtitle="Tu contraseña ha sido cambiada exitosamente"
      >
        <ResetPasswordSuccess />
      </AuthLayout>
    );
  }

  if (!oobCode) {
    return (
      <AuthLayout
        title="Enlace inválido"
        subtitle="El enlace de recuperación no es válido o ha expirado"
      >
        <ResetPasswordInvalidLink />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Restablecer contraseña"
      subtitle="Ingresa tu nueva contraseña para completar el proceso"
    >
      <ResetPasswordForm
        password={password}
        confirmPassword={confirmPassword}
        loading={loading}
        errors={errors}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={handleConfirmPasswordChange}
        onSubmit={handleSubmit}
      />
      
      {/* Login link */}
      <p className="text-center text-gray-600 text-sm my-4">
        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
          Volver al inicio de sesión
        </Link>
      </p>
    </AuthLayout>
  );
}

// Componente principal con Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout
        title="Restablecer Contraseña"
        subtitle="Cargando..."
      >
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </AuthLayout>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

