import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalBaseProps {
    isOpen: boolean;
    onClose: () => void;
    children: (props: { isClosing: boolean; handleClose: () => void }) => React.ReactNode;
    maxWidth?: string;
    showCloseButton?: boolean;
}

const ModalBase = ({
    isOpen,
    onClose,
    children,
    maxWidth = 'max-w-md',
    showCloseButton = true
}: ModalBaseProps) => {
    const [isClosing, setIsClosing] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            const timer = setTimeout(() => setShouldRender(true), 10);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setShouldRender(false);
            onClose();
        }, 300);
    };

    if (!isOpen && !isClosing) return null;

    return (
        <div
            className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-all duration-300 ${isClosing || !shouldRender ? 'opacity-0' : 'opacity-100'
                }`}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)'
            }}
            onClick={handleClose}
        >
            <div
                className={`relative w-full ${maxWidth} rounded-3xl shadow-2xl transition-all duration-300 ${isClosing || !shouldRender ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                    }`}
                style={{
                    backgroundColor: 'var(--background)',
                    border: '2px solid rgba(var(--principal-rgb), 0.2)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {showCloseButton && (
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10"
                        style={{
                            backgroundColor: 'rgba(var(--foreground-rgb), 0.05)',
                            color: 'var(--foreground)'
                        }}
                    >
                        <X size={20} />
                    </button>
                )}

                {children({ isClosing, handleClose })}
            </div>

            <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        @keyframes slide-right {
          from {
            transform: translateX(-30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-left {
          from {
            transform: translateX(30px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-right {
          animation: slide-right 0.4s ease-out;
        }

        .animate-slide-left {
          animation: slide-left 0.4s ease-out;
        }
      `}</style>
        </div>
    );
};

export default ModalBase;
