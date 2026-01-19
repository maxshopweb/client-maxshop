import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { passwordSchema } from '@/app/schemas/auth.schema';

/**
 * Hook para manejar el flujo de restablecimiento de contraseña
 * Maneja oobCode, validación de contraseñas y envío
 */
export const useResetPassword = () => {
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [oobCode, setOobCode] = useState<string | null>(null);

  // Obtener y validar oobCode de la URL
  useEffect(() => {
    // Firebase puede enviar el código de varias formas:
    // 1. Como parámetro directo: ?oobCode=...
    // 2. Desde su página de acción: ?mode=resetPassword&oobCode=...
    // 3. En el hash: #oobCode=...
    
    const code = searchParams.get('oobCode') || 
                 searchParams.get('code') || 
                 searchParams.get('oob');
    
    // También verificar en el hash de la URL (Firebase a veces lo pone ahí)
    let hashCode = null;
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      hashCode = hashParams.get('oobCode') || hashParams.get('code') || hashParams.get('oob');
    }
    
    // Si viene de la página de Firebase, puede estar en la URL completa
    let urlCode = null;
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href;
      const urlMatch = fullUrl.match(/[?&]oobCode=([^&]+)/);
      if (urlMatch) {
        urlCode = decodeURIComponent(urlMatch[1]);
      }
    }
    
    const finalCode = code || hashCode || urlCode;
    
    console.log('🔍 [useResetPassword] Buscando oobCode:', {
      searchParams: code,
      hash: hashCode,
      url: urlCode,
      finalCode,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'N/A'
    });
    
    if (!finalCode) {
      console.error('❌ [useResetPassword] No se encontró oobCode en la URL');
      toast.error('Enlace inválido o expirado. Por favor, solicita un nuevo enlace de recuperación.');
      // No redirigir inmediatamente, dejar que el usuario vea el mensaje
      return;
    }
    
    console.log('✅ [useResetPassword] oobCode encontrado:', finalCode);
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

  return {
    password,
    confirmPassword,
    loading,
    success,
    errors,
    oobCode,
    handleSubmit,
    handlePasswordChange,
    handleConfirmPasswordChange
  };
};

