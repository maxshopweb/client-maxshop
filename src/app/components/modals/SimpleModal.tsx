import ModalBase from "./BaseModal";

interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    actions?: (handleClose: () => void) => React.ReactNode;
    maxWidth?: string;
}

const SimpleModal = ({
    isOpen,
    onClose,
    title,
    children,
    actions,
    maxWidth = 'max-w-md'
}: SimpleModalProps) => {
    return (
        <ModalBase isOpen={isOpen} onClose={onClose} maxWidth={maxWidth}>
            {({ handleClose }) => (
                <div className="p-8">
                    {title && (
                        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
                            {title}
                        </h2>
                    )}

                    <div className="mb-8">
                        {children}
                    </div>

                    {actions && (
                        <div className="flex gap-3">
                            {actions(handleClose)}
                        </div>
                    )}
                </div>
            )}
        </ModalBase>
    );
};

export default SimpleModal;
