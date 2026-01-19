import { useState } from "react";
import ConfirmModal from "../modals/ConfirmModal";
import SimpleModal from "../modals/SimpleModal";
import StepModal from "../modals/StepModal";

export default function ModalDemo() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [showStep, setShowStep] = useState(false);
    const [showSimple, setShowSimple] = useState(false);

    const demoSteps = [
        {
            title: 'Paso 1',
            content: (
                <div className="space-y-4">
                    <p style={{ color: 'var(--foreground)' }}>Este es el contenido del paso 1</p>
                    <p style={{ color: 'rgba(var(--foreground-rgb), 0.7)' }}>
                        Aquí podés poner cualquier contenido: inputs, imágenes, texto, etc.
                    </p>
                </div>
            )
        },
        {
            title: 'Paso 2',
            content: (
                <div className="space-y-4">
                    <p style={{ color: 'var(--foreground)' }}>Este es el contenido del paso 2</p>
                    <p style={{ color: 'rgba(var(--foreground-rgb), 0.7)' }}>
                        El contenido se anima con slide al cambiar de paso.
                    </p>
                </div>
            )
        },
        {
            title: 'Paso 3',
            content: (
                <div className="space-y-4">
                    <p style={{ color: 'var(--foreground)' }}>¡Último paso!</p>
                    <p style={{ color: 'rgba(var(--foreground-rgb), 0.7)' }}>
                        Al finalizar, se ejecuta la función onComplete.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--background)' }}>
            <div className="max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'var(--foreground)' }}>
                    Sistema de Modales MaxShop
                </h1>

                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="py-4 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                        style={{
                            backgroundColor: 'var(--principal)',
                            color: 'white'
                        }}
                    >
                        Confirmación
                    </button>

                    <button
                        onClick={() => setShowStep(true)}
                        className="py-4 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                        style={{
                            backgroundColor: 'var(--secundario)',
                            color: 'white'
                        }}
                    >
                        Con Steps
                    </button>

                    <button
                        onClick={() => setShowSimple(true)}
                        className="py-4 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                        style={{
                            backgroundColor: 'var(--terciario)',
                            color: 'white'
                        }}
                    >
                        Simple
                    </button>
                </div>

                {/* Modal de Confirmación */}
                <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={() => {
                        setShowConfirm(false);
                    }}
                    type="success"
                    title="¡Acción Confirmada!"
                    description="Tu operación se ha completado exitosamente."
                />

                {/* Modal con Steps */}
                <StepModal
                    isOpen={showStep}
                    onClose={() => setShowStep(false)}
                    onComplete={() => {
                        setShowStep(false);
                    }}
                    title="Proceso con Pasos"
                    steps={demoSteps}
                />

                {/* Modal Simple */}
                <SimpleModal
                    isOpen={showSimple}
                    onClose={() => setShowSimple(false)}
                    title="Modal Simple"
                    maxWidth="max-w-lg"
                    actions={(handleClose) => (
                        <>
                            <button
                                onClick={handleClose}
                                className="flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                                style={{
                                    backgroundColor: 'rgba(var(--foreground-rgb), 0.08)',
                                    color: 'var(--foreground)',
                                    border: '1.5px solid rgba(var(--foreground-rgb), 0.15)'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => {
                                    handleClose();
                                }}
                                className="flex-1 py-3 px-6 rounded-2xl font-medium transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
                                style={{
                                    backgroundColor: 'var(--principal)',
                                    color: 'white'
                                }}
                            >
                                Guardar
                            </button>
                        </>
                    )}
                >
                    <div className="space-y-4">
                        <p style={{ color: 'var(--foreground)' }}>
                            Este es un modal simple donde podés poner cualquier contenido.
                        </p>
                        <p style={{ color: 'rgba(var(--foreground-rgb), 0.7)' }}>
                            Perfecto para formularios, galerías de imágenes, o cualquier contenido personalizado.
                        </p>
                    </div>
                </SimpleModal>
            </div>
        </div>
    );
}
