'use client';

import AuthLayout from '@/app/components/layouts/authLayout';
import { Button } from '@/app/components/ui/Button';
import { Mail, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useEmailVerificationGuard } from '@/app/hooks/auth/useEmailVerificationGuard';
import { useHandleResendEmailVerification } from '@/app/hooks/auth/useHandleResendEmailVerification';

export default function VerifyEmailPage() {
  // El guard maneja la protección y redirección automática
  useEmailVerificationGuard();
  const { email, checking, resending, handleCheckVerification, handleResendEmail, handleBackRegister } = useHandleResendEmailVerification();

  return (
    <AuthLayout
      title="Verifica tu email"
      subtitle="Necesitamos confirmar tu dirección de correo"
    >
      <div className="flex flex-col gap-6">
        {/* Icono y mensaje */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
            <Mail className="w-10 h-10 text-orange-600" />
          </div>
          
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Revisa tu bandeja de entrada
            </h3>
            {email && (
              <p className="text-sm text-gray-600">
                Hemos enviado un email de verificación a{' '}
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
            )}
            <p className="text-sm text-gray-600">
              Haz clic en el enlace del email para verificar tu cuenta y continuar.
            </p>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-900 font-medium">¿No recibiste el email?</p>
              <ul className="text-xs text-blue-800 mt-1 space-y-1 list-disc list-inside">
                <li>Revisa tu carpeta de spam o correo no deseado</li>
                <li>Asegúrate de que el email esté escrito correctamente</li>
                <li>Puede tardar unos minutos en llegar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="primary"
            size="md"
            fullWidth
            onClick={handleCheckVerification}
            disabled={checking}
          >
            {checking ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Ya verifiqué mi email
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline-primary"
            size="md"
            fullWidth
            onClick={handleResendEmail}
            disabled={resending}
            className="text-[var(--principal)] hover:text-[var(--principal)]"
          >
            {resending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Reenviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Reenviar email de verificación
              </>
            )}
          </Button>
        </div>

        {/* Link de regreso */}
        <p className="text-center text-gray-600 text-sm pb-4">
          ¿Cambiaste de opinión?{' '}
          <button
            onClick={handleBackRegister}
            className="text-orange-600 hover:text-orange-700 font-semibold"
          >
            Volver al registro
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}

