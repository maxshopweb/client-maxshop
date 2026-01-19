'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import AuthLayout from '@/app/components/layouts/authLayout';
import { useAuthAction } from '@/app/hooks/auth/useAuthAction';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import PasswordRequirements from '@/app/components/ui/PasswordRequirements';
import { Lock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { passwordSchema } from '@/app/schemas/auth.schema';

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

function AuthActionContent() {
  const {
    mode,
    loading,
    error,
    // ResetPassword
    password,
    confirmPassword,
    passwordErrors,
    resettingPassword,
    passwordResetSuccess,
    handleResetPassword,
    handlePasswordChange,
    handleConfirmPasswordChange,
    // VerifyEmail
    verifyingEmail,
    emailVerified,
  } = useAuthAction();

  // Estado de carga inicial
  if (loading) {
    return (
      <AuthLayout
        title="Cargando..."
        subtitle="Verificando enlace"
      >
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
        </div>
      </AuthLayout>
    );
  }

  // Error general
  if (error && !mode) {
    return (
      <AuthLayout
        title="Error"
        subtitle="No se pudo procesar la acción"
      >
        <div className="flex flex-col items-center gap-4 py-8">
          <XCircle className="h-16 w-16 text-red-500" />
          <p className="text-center text-gray-600">{error}</p>
          <Link href="/login">
            <Button variant="primary" size="md">
              Ir al inicio de sesión
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  // Reset Password - Éxito
  if (mode === 'resetPassword' && passwordResetSuccess) {
    return (
      <AuthLayout
        title="Contraseña restablecida"
        subtitle="Tu contraseña ha sido cambiada exitosamente"
      >
        <div className="flex flex-col items-center gap-4 py-8">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <p className="text-center text-gray-600">
            Tu contraseña ha sido restablecida correctamente. Serás redirigido al inicio de sesión.
          </p>
        </div>
      </AuthLayout>
    );
  }

  // Reset Password - Formulario
  if (mode === 'resetPassword') {
    return (
      <AuthLayout
        title="Restablecer contraseña"
        subtitle="Ingresa tu nueva contraseña para completar el proceso"
      >
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div>
            <Input
              id="password"
              type="password"
              label="Nueva contraseña"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
              disabled={resettingPassword}
              error={passwordErrors.password}
              schema={passwordSchema}
              icon={Lock}
            />
            <PasswordRequirements password={password} />
          </div>

          <Input
            id="confirmPassword"
            type="password"
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="••••••••"
            required
            disabled={resettingPassword}
            error={passwordErrors.confirmPassword}
            icon={Lock}
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={resettingPassword || !password || !confirmPassword}
          >
            {resettingPassword ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Restableciendo...
              </>
            ) : (
              'Restablecer contraseña'
            )}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm my-4">
          <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
            Volver al inicio de sesión
          </Link>
        </p>
      </AuthLayout>
    );
  }

  // Verify Email - Verificando
  if (mode === 'verifyEmail' && verifyingEmail) {
    return (
      <AuthLayout
        title="Verificando email"
        subtitle="Por favor espera mientras verificamos tu email"
      >
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="animate-spin h-12 w-12 text-orange-600" />
          <p className="text-center text-gray-600">Verificando tu dirección de email...</p>
        </div>
      </AuthLayout>
    );
  }

  // Verify Email - Éxito
  if (mode === 'verifyEmail' && emailVerified) {
    return (
      <AuthLayout
        title="Email verificado"
        subtitle="Tu email ha sido verificado exitosamente"
      >
        <div className="flex flex-col items-center gap-4 py-8">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
          <p className="text-center text-gray-600">
            Tu email ha sido verificado correctamente. Serás redirigido al inicio de sesión.
          </p>
        </div>
      </AuthLayout>
    );
  }

  // Verify Email - Error
  if (mode === 'verifyEmail' && error) {
    return (
      <AuthLayout
        title="Error al verificar"
        subtitle="No se pudo verificar tu email"
      >
        <div className="flex flex-col items-center gap-4 py-8">
          <XCircle className="h-16 w-16 text-red-500" />
          <p className="text-center text-gray-600">{error}</p>
          <div className="flex flex-col gap-2 w-full">
            <Link href="/login">
              <Button variant="primary" size="md" fullWidth>
                Ir al inicio de sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="white-primary" size="md" fullWidth>
                Volver al registro
              </Button>
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Estado por defecto (no debería llegar aquí)
  return (
    <AuthLayout
      title="Acción no reconocida"
      subtitle="La acción solicitada no es válida"
    >
      <div className="flex flex-col items-center gap-4 py-8">
        <XCircle className="h-16 w-16 text-red-500" />
        <p className="text-center text-gray-600">
          No se pudo identificar la acción a realizar. Por favor, verifica el enlace.
        </p>
        <Link href="/login">
          <Button variant="primary" size="md">
            Ir al inicio de sesión
          </Button>
        </Link>
      </div>
    </AuthLayout>
  );
}

// Componente principal con Suspense boundary
export default function AuthActionPage() {
  return (
    <Suspense fallback={
      <AuthLayout
        title="Cargando..."
        subtitle="Verificando enlace"
      >
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-orange-600" />
        </div>
      </AuthLayout>
    }>
      <AuthActionContent />
    </Suspense>
  );
}

