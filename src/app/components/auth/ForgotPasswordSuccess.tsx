/**
 * Componente de presentación para mostrar el estado de éxito
 * cuando se envía el correo de recuperación
 * No contiene lógica, solo renderiza la UI
 */
export function ForgotPasswordSuccess() {
  return (
    <div className="flex flex-col gap-4 items-center text-center">
      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-green-600"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Correo enviado
        </h2>
        <p className="text-sm text-gray-600">
          Revisa tu bandeja de entrada. Te hemos enviado las instrucciones para restablecer tu contraseña.
        </p>
      </div>
    </div>
  );
}

