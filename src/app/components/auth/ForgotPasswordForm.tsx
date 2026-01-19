import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import { Mail } from 'lucide-react';
import { emailSchema } from '@/app/schemas/auth.schema';

interface ForgotPasswordFormProps {
  email: string;
  loading: boolean;
  error?: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Componente de presentación para el formulario de recuperación de contraseña
 * No contiene lógica, solo renderiza la UI
 */
export function ForgotPasswordForm({
  email,
  loading,
  error,
  onEmailChange,
  onSubmit
}: ForgotPasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {/* Email field */}
      <Input
        id="email"
        type="email"
        label="Tu email"
        value={email}
        onChange={onEmailChange}
        placeholder="tu@email.com"
        required
        disabled={loading}
        error={error}
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
  );
}

