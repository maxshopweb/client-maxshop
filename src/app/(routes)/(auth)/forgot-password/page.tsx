'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'sonner';
import { Mail } from 'lucide-react';
import { emailSchema } from '@/app/schemas/auth.schema';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validar email
      const emailResult = emailSchema.safeParse(email);
      if (!emailResult.success) {
        const fieldErrors: typeof errors = {};
        emailResult.error.issues.forEach((err) => {
          if (err.path[0] === 'email') {
            fieldErrors.email = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      const success = await forgotPassword(email.trim());
      if (success) {
        setSent(true);
        toast.success('Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
      } else {
        toast.error('Error al enviar el correo. Verifica que el email sea correcto.');
      }
    } catch (error: any) {
      console.error('Error al enviar correo de recuperación:', error);
      toast.error(error?.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (errors.email) {
      const result = emailSchema.safeParse(value);
      if (result.success) {
        setErrors((prev) => ({ ...prev, email: undefined }));
      } else {
        setErrors((prev) => ({ ...prev, email: result.error.issues[0]?.message }));
      }
    }
  };

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Ingresa tu email para recibir las instrucciones"
    >
      {!sent ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email field */}
          <Input
            id="email"
            type="email"
            label="Tu email"
            value={email}
            onChange={handleEmailChange}
            placeholder="tu@email.com"
            required
            disabled={loading}
            error={errors.email}
            schema={emailSchema}
            icon={Mail}
          />

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              Correo enviado
            </h2>
            <p className="text-sm text-gray-600">
              Revisa tu bandeja de entrada. Te hemos enviado las instrucciones para restablecer tu contraseña.
            </p>
          </div>
        </div>
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
