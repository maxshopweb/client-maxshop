import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import PasswordRequirements from '@/app/components/ui/PasswordRequirements';
import { Lock } from 'lucide-react';
import { passwordSchema } from '@/app/schemas/auth.schema';

interface ResetPasswordFormProps {
  password: string;
  confirmPassword: string;
  loading: boolean;
  errors: {
    password?: string;
    confirmPassword?: string;
  };
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

/**
 * Componente de presentación para el formulario de restablecimiento de contraseña
 * No contiene lógica, solo renderiza la UI
 */
export function ResetPasswordForm({
  password,
  confirmPassword,
  loading,
  errors,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit
}: ResetPasswordFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <Input
            id="password"
            type="password"
            label="Nueva contraseña"
            value={password}
            onChange={onPasswordChange}
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
          onChange={onConfirmPasswordChange}
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
    </>
  );
}

