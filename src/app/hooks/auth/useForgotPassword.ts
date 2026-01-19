import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { useEmailForm } from './useEmailForm';

/**
 * Hook para manejar el flujo de recuperación de contraseña
 * Usa useEmailForm para manejar el email
 * Maneja el envío y el estado de éxito
 */
export const useForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { email, errors, handleEmailChange, validateEmail, clearErrors, setErrors } = useEmailForm();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearErrors();

    try {
      // Validar email
      if (!validateEmail()) {
        setLoading(false);
        return;
      }

      console.log('📧 [useForgotPassword] Intentando enviar email a:', email.trim());
      const success = await forgotPassword(email.trim());
      
      if (success) {
        console.log('✅ [useForgotPassword] Email enviado exitosamente');
        setSent(true);
        toast.success('Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
      } else {
        console.error('❌ [useForgotPassword] Error al enviar email (success = false)');
        toast.error('Error al enviar el correo. Verifica que el email sea correcto.');
      }
    } catch (error: any) {
      console.error('❌ [useForgotPassword] Error capturado:', error);
      console.error('❌ [useForgotPassword] Detalles del error:', {
        message: error?.message,
        stack: error?.stack
      });
      toast.error(error?.message || 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    loading,
    sent,
    errors,
    handleEmailChange,
    handleSubmit
  };
};

