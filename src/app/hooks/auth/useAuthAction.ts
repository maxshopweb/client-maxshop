import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import AuthService from '@/app/services/auth.service';
import { toast } from 'sonner';
import { passwordSchema } from '@/app/schemas/auth.schema';

type AuthActionMode = 'resetPassword' | 'verifyEmail' | null;

export const useAuthAction = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [mode, setMode] = useState<AuthActionMode>(null);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para resetPassword
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  
  // Estados para verifyEmail
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Capturar parámetros de la URL
  useEffect(() => {
    const urlMode = searchParams.get('mode') as AuthActionMode;
    const urlOobCode = searchParams.get('oobCode');
    const urlApiKey = searchParams.get('apiKey');

    console.log('🔍 [useAuthAction] Parámetros detectados:', { urlMode, urlOobCode, urlApiKey });

    if (!urlMode || !urlOobCode) {
      setError('Parámetros inválidos en la URL. El enlace puede estar incompleto.');
      setLoading(false);
      return;
    }

    if (urlMode !== 'resetPassword' && urlMode !== 'verifyEmail') {
      setError(`Modo de acción no válido: ${urlMode}`);
      setLoading(false);
      return;
    }

    setMode(urlMode);
    setOobCode(urlOobCode);
    setApiKey(urlApiKey);
    setLoading(false);
  }, [searchParams]);

  // Efecto separado para verificar email automáticamente cuando el código esté listo
  useEffect(() => {
    if (mode === 'verifyEmail' && oobCode && !verifyingEmail && !emailVerified && !error) {
      handleVerifyEmail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, oobCode]);

  const handleVerifyEmail = async () => {
    if (!oobCode || verifyingEmail || emailVerified) return;

    setVerifyingEmail(true);
    setError(null);

    try {
      const result = await AuthService.verifyEmail(oobCode);
      
      if (result.success) {
        setEmailVerified(true);
        toast.success('¡Email verificado exitosamente!');
        
        // Redirigir a completar perfil (siguiente paso del flujo) en la misma pestaña
        setTimeout(() => {
          router.push('/register/complete-perfil');
        }, 2000);
      } else {
        setError(result.error || 'Error al verificar el email');
        toast.error(result.error || 'Error al verificar el email');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al verificar el email';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setVerifyingEmail(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      setError('Código de verificación no encontrado');
      return;
    }

    setResettingPassword(true);
    setPasswordErrors({});
    setError(null);

    try {
      // Validar contraseña
      const passwordResult = passwordSchema.safeParse(password);
      if (!passwordResult.success) {
        const fieldErrors: typeof passwordErrors = {};
        passwordResult.error.issues.forEach((err) => {
          if (err.path[0] === 'password') {
            fieldErrors.password = err.message;
          }
        });
        setPasswordErrors(fieldErrors);
        setResettingPassword(false);
        return;
      }

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        setPasswordErrors({ confirmPassword: 'Las contraseñas no coinciden' });
        setResettingPassword(false);
        return;
      }

      // Resetear contraseña
      const result = await AuthService.resetPassword(oobCode, password);
      
      if (result.success) {
        setPasswordResetSuccess(true);
        toast.success('¡Contraseña restablecida exitosamente!');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || 'Error al restablecer la contraseña');
        toast.error(result.error || 'Error al restablecer la contraseña');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Error al restablecer la contraseña';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setResettingPassword(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (passwordErrors.password) {
      const result = passwordSchema.safeParse(value);
      if (result.success) {
        setPasswordErrors((prev) => ({ ...prev, password: undefined }));
      } else {
        setPasswordErrors((prev) => ({ ...prev, password: result.error.issues[0]?.message }));
      }
    }
    
    if (confirmPassword && passwordErrors.confirmPassword) {
      if (value === confirmPassword) {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      } else {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (passwordErrors.confirmPassword || password) {
      if (value === password) {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: undefined }));
      } else if (value) {
        setPasswordErrors((prev) => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
      }
    }
  };

  return {
    mode,
    oobCode,
    apiKey,
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
  };
};

