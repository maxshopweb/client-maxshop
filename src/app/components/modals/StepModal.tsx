import { useState } from "react";
import ModalBase from "./BaseModal";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../ui/Button";

interface StepModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    title: string;
    steps: {
        title: string;
        content: React.ReactNode;
        onNext?: () => Promise<boolean> | boolean; // ← AGREGAR
    }[];
    initialStep?: number;
    isLoading?: boolean;
}

const StepModal = ({
    isOpen,
    onClose,
    onComplete,
    title,
    steps,
    isLoading = false,
    initialStep = 0
}: StepModalProps) => {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const [slideDirection, setSlideDirection] = useState('right');
    const [isValidating, setIsValidating] = useState(false); // ← AGREGAR

    const handleModalClose = () => {
        setCurrentStep(initialStep);
        onClose();
    };

    return (
        <ModalBase isOpen={isOpen} onClose={handleModalClose} maxWidth="max-w-2xl">
            {({ handleClose }) => {
                const handleNext = async () => { // ← HACER ASYNC
                    // Validar step actual si tiene validación
                    if (steps[currentStep].onNext) {
                        setIsValidating(true);
                        const isValid = await steps[currentStep].onNext!();
                        setIsValidating(false);

                        if (!isValid) return; // No avanzar si no es válido
                    }

                    if (currentStep < steps.length - 1) {
                        setSlideDirection('right');
                        setTimeout(() => setCurrentStep(currentStep + 1), 50);
                    } else {
                        onComplete();
                        handleClose();
                    }
                };

                const handlePrev = () => {
                    if (currentStep > 0) {
                        setSlideDirection('left');
                        setTimeout(() => setCurrentStep(currentStep - 1), 50);
                    }
                };

                return (
                    <div className="py-8 px-6">
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                            {title}
                        </h2>

                        {/* Step Indicator Minimalista */}
                        <div className="relative mb-8">
                            <div
                                className="absolute top-2 h-[2px]"
                                style={{
                                    backgroundColor: 'rgba(var(--foreground-rgb), 0.1)',
                                    left: '10px',
                                    right: '10px',
                                    zIndex: 0
                                }}
                            />

                            <div
                                className="absolute top-2 h-[2px] transition-all duration-500"
                                style={{
                                    left: '10px',
                                    width: steps.length > 1
                                        ? `calc((100% - 20px) * ${currentStep / (steps.length - 1)})`
                                        : '0%',
                                    backgroundColor: 'var(--principal)',
                                    zIndex: 0
                                }}
                            />

                            <div className="relative flex justify-between" style={{ zIndex: 1 }}>
                                {steps.map((step, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                        <div
                                            className="w-5 h-5 rounded-full transition-all duration-300"
                                            style={{
                                                backgroundColor: index <= currentStep ? 'var(--principal)' : 'var(--background)',
                                                border: `2px solid ${index <= currentStep ? 'var(--principal)' : 'rgba(var(--foreground-rgb), 0.2)'}`,
                                                boxShadow: index === currentStep ? '0 0 0 3px rgba(var(--principal-rgb), 0.2)' : 'none'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-hidden">
                            <div key={currentStep} className={`animate-slide-${slideDirection}`}>
                                <div className="mb-8">
                                    {steps[currentStep].content}
                                </div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 justify-end">
                            {currentStep > 0 && (
                                <Button
                                    onClick={handlePrev}
                                    variant="outline-cancel"
                                    disabled={isValidating}
                                >
                                    <ChevronLeft size={20} />
                                    Anterior
                                </Button>
                            )}
                            <Button
                                onClick={handleNext}
                                variant="primary"
                                disabled={isValidating}
                            >
                                {isLoading
                                    ? 'Creando...'
                                    : isValidating
                                        ? 'Validando...'
                                        : currentStep === steps.length - 1
                                            ? 'Finalizar'
                                            : 'Siguiente'}

                                {!isValidating && currentStep < steps.length - 1 && <ChevronRight size={20} />}
                            </Button>
                        </div>
                    </div>
                );
            }}
        </ModalBase>
    );
};

export default StepModal;
