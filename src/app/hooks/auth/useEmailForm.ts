import { useState } from 'react';
import { emailSchema } from '@/app/schemas/auth.schema';

/**
 * Hook compartido para manejar formularios de email
 * Maneja estado, validación y errores del campo email
 */
export const useEmailForm = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string }>({});

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

  const validateEmail = () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      const fieldErrors: { email?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0] === 'email') {
          fieldErrors.email = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }
    return true;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    email,
    errors,
    handleEmailChange,
    validateEmail,
    clearErrors,
    setEmail,
    setErrors
  };
};

