'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import SimpleModal from '@/app/components/modals/SimpleModal';
import Input from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  password: string;
  title?: string;
  subtitle?: string;
};

export function CopyPasswordModal({ isOpen, onClose, password, title, subtitle }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <SimpleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title ?? 'Contraseña generada'}
      maxWidth="max-w-md"
      actions={(close) => (
        <Button variant="primary" className="w-full sm:w-auto" onClick={close}>
          Cerrar
        </Button>
      )}
    >
      <div className="space-y-4">
        {subtitle != null && subtitle !== '' && (
          <p className="text-sm text-input/80">{subtitle}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            readOnly
            value={password}
            className="font-mono text-sm"
            onFocus={(e) => e.target.select()}
          />
          <Button
            type="button"
            variant="outline-primary"
            className="shrink-0 inline-flex items-center justify-center gap-2"
            onClick={() => void handleCopy()}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copiar
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-amber-700">
          Guardá o copiá esta contraseña ahora. No se volverá a mostrar en la lista de usuarios.
        </p>
      </div>
    </SimpleModal>
  );
}
