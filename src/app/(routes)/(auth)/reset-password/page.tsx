'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'sonner';
import { Lock, CheckCircle2 } from 'lucide-react';
import { passwordSchema } from '@/app/schemas/auth.schema';
import PasswordRequirements from '@/app/components/ui/PasswordRequirements';

// Hacer la página dinámica para evitar prerender
export const dynamic = 'force-dynamic';

// Componente interno que usa useSearchParams
function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [oobCode, setOobCode] = useState<string | null>(null);
  
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Obtener el código OOB de la URL
    // Firebase puede enviarlo como 'oobCode' directamente o en el hash
    const code = searchParams.get('oobCode') || 
                 searchParams.get('code') || 
                 searchParams.get('oob');
    
    // También verificar en el hash de la URL (Firebase a veces lo pone ahí)
    let hashCode = null;
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      hashCode = hashParams.get('oobCode') || hashParams.get('code') || hashParams.get('oob');
    }
    
    const finalCode = code || hashCode;
    
    if (!finalCode) {
      toast.error('Enlace inválido o expirado. Por favor, solicita un nuevo enlace de recuperación.');
      router.push('/forgot-password');
      return;
    }
    
    setOobCode(finalCode);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validar contraseña
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        const fieldErrors: typeof errors = {};
        passwordResult.error.issues.forEach((err) => {
          if (err.path[0] === 'password') {
            fieldErrors.password = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        setErrors({ confirmPassword: 'Las contraseñas no coinciden' });
        setLoading(false);
        return;
      }

      if (!oobCode) {
        toast.error('Enlace inválido. Por favor, solicita un nuevo enlace de recuperación.');
        router.push('/forgot-password');
        setLoading(false);
        return;
      }

      // Resetear contraseña
      const result = await resetPassword(oobCode, password);
      
      if (result.success) {
        setSuccess(true);
        toast.success('¡Contraseña restablecida exitosamente!');
        
        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error(result.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
        setErrors({ password: result.message || 'Error al restablecer la contraseña' });
      }
    } catch (error: any) {
      console.error('Error al restablecer contraseña:', error);
      toast.error(error?.message || 'Error al restablecer la contraseña');
      setErrors({ password: error?.message || 'Error al restablecer la contraseña' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (errors.password) {
      const result = passwordSchema.safeParse(value);
      if (result.success) {
        setErrors((prev) => ({ ...prev, password: undefined }));
      } else {
        setErrors((prev) => ({ ...prev, password: result.error.issues[0]?.message }));
      }
    }
    
    if (confirmPassword && errors.confirmPassword) {
      if (value === confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (errors.confirmPassword || password) {
      if (value === password) {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      } else if (value) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      }
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Contraseña restablecida"
        subtitle="Tu contraseña ha sido cambiada exitosamente"
      >
        <div className="flex flex-col gap-4 items-center text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-900">
              ¡Listo!
            </h2>
            <p className="text-sm text-gray-600">
              Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!oobCode) {
    return (
      <AuthLayout
        title="Enlace inválido"
        subtitle="El enlace de recuperación no es válido o ha expirado"
      >
        <div className="flex flex-col gap-4 items-center text-center">
          <p className="text-sm text-gray-600">
            Por favor, solicita un nuevo enlace de recuperación de contraseña.
          </p>
          <Link href="/forgot-password">
            <Button variant="primary" size="md">
              Solicitar nuevo enlace
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Restablecer contraseña"
      subtitle="Ingresa tu nueva contraseña"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Input
            id="password"
            type="password"
            label="Nueva contraseña"
            value={password}
            onChange={handlePasswordChange}
            placeholder="••••••••"
            required
            disabled={loading}
            error={errors.password}
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
          disabled={loading}
          error={errors.confirmPassword}
          icon={Lock}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </Button>
      </form>

      <p className="text-center text-gray-600 text-sm">
        ¿Recordaste tu contraseña?{' '}
        <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
          Inicia sesión
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

