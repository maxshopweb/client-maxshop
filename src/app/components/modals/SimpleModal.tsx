import ModalBase from "./BaseModal";
import { createContext, useContext } from "react";

interface SimpleModalContextType {
    handleClose: () => void;
}

const SimpleModalContext = createContext<SimpleModalContextType | null>(null);

export const useSimpleModal = () => {
    const context = useContext(SimpleModalContext);
    if (!context) {
        throw new Error('useSimpleModal must be used within SimpleModal');
    }
    return context;
};

interface SimpleModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode | ((handleClose: () => void) => React.ReactNode);
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
                <SimpleModalContext.Provider value={{ handleClose }}>
                    <div className="p-8 text-foreground">
                        {title && (
                            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--foreground)' }}>
                                {title}
                            </h2>
                        )}

                        <div className="mb-8">
                            {typeof children === 'function' ? children(handleClose) : children}
                        </div>

                        {actions && (
                            <div className="flex gap-3">
                                {actions(handleClose)}
                            </div>
                        )}
                    </div>
                </SimpleModalContext.Provider>
            )}
        </ModalBase>
    );
};

export default SimpleModal;
