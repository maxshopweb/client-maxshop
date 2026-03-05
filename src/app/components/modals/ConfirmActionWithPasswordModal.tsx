'use client';

import { useState, useCallback } from 'react';
import { Lock } from 'lucide-react';
import ModalBase from '@/app/components/modals/BaseModal';
import { Button } from '@/app/components/ui/Button';
import Input from '@/app/components/ui/Input';
import AuthService from '@/app/services/auth.service';
import { auth } from '@/app/lib/firebase.config';

export interface ConfirmActionWithPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message?: string;
    confirmLabel?: string;
    /** Se llama después de verificar la contraseña. Si lanza, el modal no se cierra y se puede mostrar error. */
    onConfirm: () => Promise<void>;
}

/**
 * Modal reutilizable: pide contraseña actual para confirmar una acción sensible.
 * Flujo: usuario ingresa contraseña → reauth con Firebase → onConfirm() → cierra.
 */
export function ConfirmActionWithPasswordModal({
    isOpen,
    onClose,
    title,
    message = 'Para confirmar, ingresá tu contraseña actual.',
    confirmLabel = 'Confirmar',
    onConfirm,
}: ConfirmActionWithPasswordModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const email = typeof window !== 'undefined' ? auth.currentUser?.email ?? '' : '';

    const handleSubmit = useCallback(async () => {
        setError(null);
        if (!password.trim()) {
            setError('Ingresá tu contraseña.');
            return;
        }
        if (!email) {
            setError('No se pudo obtener tu email. Iniciá sesión de nuevo.');
            return;
        }
        setLoading(true);
        try {
            const result = await AuthService.reauthenticate(email, password);
            if (!result.success || result.error) {
                setError(result.error ?? 'Contraseña incorrecta.');
                setLoading(false);
                return;
            }
            await onConfirm();
            setPassword('');
            setError(null);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al confirmar.');
        } finally {
            setLoading(false);
        }
    }, [password, email, onConfirm, onClose]);

    const handleClose = useCallback(() => {
        setPassword('');
        setError(null);
        onClose();
    }, [onClose]);

    return (
        <ModalBase isOpen={isOpen} onClose={handleClose} maxWidth="max-w-md" showCloseButton>
            {() => (
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="shrink-0 w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-foreground" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                            <p className="text-sm text-foreground/70 mt-0.5">{message}</p>
                        </div>
                    </div>
                    {email && (
                        <p className="text-xs text-foreground/60 mb-3">
                            Verificación para: <span className="font-medium">{email}</span>
                        </p>
                    )}
                    <Input
                        id="confirm-password"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(null);
                        }}
                        placeholder="••••••••"
                        disabled={loading}
                        error={error ?? undefined}
                        icon={Lock}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSubmit())}
                    />
                    <div className="flex gap-3 justify-end mt-6">
                        <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="primary" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Verificando...' : confirmLabel}
                        </Button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
}
