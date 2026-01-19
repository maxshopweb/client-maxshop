import { CheckCircle2 } from 'lucide-react';

/**
 * Componente de presentación para mostrar el estado de éxito
 * cuando se restablece la contraseña exitosamente
 * No contiene lógica, solo renderiza la UI
 */
export function ResetPasswordSuccess() {
  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10 text-green-600" />
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900">
          ¡Listo!
        </h2>
        <p className="text-sm text-gray-600">
          Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión...
        </p>
      </div>
    </div>
  );
}

