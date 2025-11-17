'use client';

import { usePasswordValidation } from '@/app/hooks/usePasswordValidation';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  className?: string;
}

export default function PasswordRequirements({
  password,
  className = '',
}: PasswordRequirementsProps) {
  const { validation } = usePasswordValidation(password);

  if (!password) return null;

  const requirements = [
    { key: 'minLength', label: 'Mínimo 6 caracteres', met: validation.minLength },
    { key: 'hasNumber', label: 'Al menos un número', met: validation.hasNumber },
    { key: 'hasUpperCase', label: 'Al menos una mayúscula', met: validation.hasUpperCase },
    { key: 'hasLowerCase', label: 'Al menos una minúscula', met: validation.hasLowerCase },
    { key: 'hasSpecialChar', label: 'Al menos un carácter especial', met: validation.hasSpecialChar },
  ];

  return (
    <div className={`mt-1 space-y-1 ${className}`}>
      {requirements.map((req) => (
        <div
          key={req.key}
          className="flex items-center gap-2 text-xs transition-colors"
          style={{
            color: req.met ? 'rgb(34, 197, 94)' : 'rgb(107, 114, 128)',
          }}
        >
          {req.met ? (
            <Check size={14} strokeWidth={2.5} className="flex-shrink-0" />
          ) : (
            <X size={14} strokeWidth={2.5} className="flex-shrink-0" />
          )}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}

