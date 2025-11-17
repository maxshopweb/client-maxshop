'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AuthLayout from '@/app/components/layouts/authLayout';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { toast } from 'sonner';
import LogoGoogle from '@/app/components/icons/LogoGoogle';
import { registerSchema, emailSchema, passwordSchema } from '@/app/schemas/auth.schema';
import PasswordRequirements from '@/app/components/ui/PasswordRequirements';
import { Mail, Lock } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { register, registerWithGoogle, isAuthenticated, user, role, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirigir si ya está autenticado con estado 3
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      // Si el estado es 2, redirigir a completar perfil
      if (user?.estado === 2) {
        router.replace('/register/complete-perfil');
        return;
      }
      
      // Si el estado es 3 (perfil completo), redirigir según rol
      if (user?.estado === 3) {
        if (role === 'ADMIN') {
          router.replace('/admin/home');
        } else {
          router.replace('/');
        }
        return;
      }
    }
  }, [isAuthenticated, user, role, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const validationResult = registerSchema.safeParse({ email, password, confirmPassword });
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

      const registerResult = await register(email, password);
      if (registerResult.success) {
        toast.success(registerResult.message || '¡Cuenta creada exitosamente!');
        toast.info('Te hemos enviado un email de verificación. Por favor, verifica tu email antes de continuar.');
        router.push('/register/verify-email');
      } else {
        toast.error(registerResult.message || 'Error al crear la cuenta');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const result = await registerWithGoogle();
      if (result.success) {
        toast.success(result.message || '¡Cuenta creada exitosamente!');
        
        // Google ya verifica el email, así que estado 2 -> completar perfil
        if (result.estado === 2) {
          window.location.href = '/register/complete-perfil';
        } else {
          router.push('/');
        }
      } else {
        toast.error(result.message || 'Error al registrarse con Google');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Error al registrarse con Google');
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

  return (
    <AuthLayout title="Comenzar" subtitle="Bienvenido a MaxShop – Comencemos">
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <div>
            <Input
              id="password"
              type="password"
              label="Crear nueva contraseña"
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              required
              disabled={loading}
              error={errors.password}
              icon={Lock}
            />
            <PasswordRequirements password={password} />
          </div>

          <Input
            id="confirmPassword"
            type="password"
            label="Confirmar contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            placeholder="••••••••"
            required
            disabled={loading}
            error={errors.confirmPassword}
            icon={Lock}
          />

          <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear nueva cuenta'}
          </Button>

          <div className="relative flex items-center gap-2 py-2">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-sm text-gray-500">O continúa con</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <Button
            type="button"
            variant="outline-primary"
            size="md"
            fullWidth
            onClick={handleGoogleRegister}
            disabled={loading}
            className="text-[var(--principal)] hover:text-[var(--principal)]/80 hover:bg-[var(--principal)]/10 rounded-md"
          >
            <LogoGoogle />
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm pt-2">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold">
            Inicia sesión
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
