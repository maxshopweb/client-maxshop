import ModalBase from "./BaseModal";
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    type = 'info',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}: ConfirmModalProps) => {
    const icons = {
        success: <CheckCircle className="w-12 h-12" style={{ color: 'var(--principal)' }} />,
        error: <AlertCircle className="w-12 h-12 text-error" />,
        warning: <AlertCircle className="w-12 h-12" style={{ color: 'var(--principal)' }} />,
        info: <Info className="w-12 h-12" style={{ color: 'var(--principal)' }} />
    };

    return (
        <ModalBase isOpen={isOpen} onClose={onClose}>
            {({ handleClose }) => (
                <div className="p-8">
                    <div className="flex justify-center mb-6 animate-bounce-in">
                        {icons[type]}
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-3" style={{ color: 'var(--foreground)' }}>
                        {title}
                    </h2>

                    {description && (
                        <p className="text-center mb-8 text-sm leading-relaxed" style={{ color: 'rgba(var(--foreground-rgb), 0.7)' }}>
                            {description}
                        </p>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            className="flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                            style={{
                                backgroundColor: 'rgba(var(--foreground-rgb), 0.08)',
                                color: 'var(--foreground)',
                                border: '1.5px solid rgba(var(--foreground-rgb), 0.15)'
                            }}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                handleClose();
                            }}
                            className="flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                            style={{
                                backgroundColor: 'var(--principal)',
                                color: 'white'
                            }}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            )}
        </ModalBase>
    );
};

export default ConfirmModal;