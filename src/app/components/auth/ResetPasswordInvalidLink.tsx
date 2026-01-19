import Link from 'next/link';
import { Button } from '@/app/components/ui/Button';

/**
 * Componente de presentación para mostrar cuando el enlace es inválido
 * No contiene lógica, solo renderiza la UI
 */
export function ResetPasswordInvalidLink() {
  return (
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
  );
}

