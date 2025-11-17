import { useMemo } from 'react';

export interface PasswordValidation {
  minLength: boolean;
  hasNumber: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
}

export const usePasswordValidation = (password: string) => {
  const validation = useMemo<PasswordValidation>(() => {
    return {
      minLength: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
  }, [password]);

  const isValid = useMemo(() => {
    return Object.values(validation).every((v) => v === true);
  }, [validation]);

  return { validation, isValid };
};

