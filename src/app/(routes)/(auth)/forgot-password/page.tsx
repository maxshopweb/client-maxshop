'use client';

import Link from 'next/link';
import AuthLayout from '@/app/components/layouts/authLayout';
import { useForgotPassword } from '@/app/hooks/auth/useForgotPassword';
import { ForgotPasswordForm } from '@/app/components/auth/ForgotPasswordForm';
import { ForgotPasswordSuccess } from '@/app/components/auth/ForgotPasswordSuccess';

export default function ForgotPasswordPage() {
  const { email, loading, sent, errors, handleEmailChange, handleSubmit } = useForgotPassword();

  return (
    <AuthLayout
      title="Recuperar contraseña"
      subtitle="Ingresa tu email para recibir las instrucciones"
    >
      {!sent ? (
        <ForgotPasswordForm
          email={email}
          loading={loading}
          error={errors.email}
          onEmailChange={handleEmailChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <ForgotPasswordSuccess />
      )}

      {/* Login link */}
      <p className="text-center text-gray-600 text-sm">
        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
          Volver al inicio de sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
