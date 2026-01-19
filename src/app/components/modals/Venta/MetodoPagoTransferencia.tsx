'use client';

import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

interface MetodoPagoTransferenciaProps {
    isSelected: boolean;
    onClick: () => void;
}

export function MetodoPagoTransferencia({ isSelected, onClick }: MetodoPagoTransferenciaProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300"
            style={{
                backgroundColor: isSelected 
                    ? "rgba(var(--principal-rgb), 0.15)" 
                    : "rgba(var(--principal-rgb), 0.08)",
                borderColor: isSelected 
                    ? "var(--principal)" 
                    : "rgba(var(--principal-rgb), 0.3)",
                boxShadow: isSelected
                    ? "0 4px 12px rgba(var(--principal-rgb), 0.2)"
                    : "0 2px 8px rgba(var(--principal-rgb), 0.1)",
            }}
        >
            <div className="flex flex-col items-center gap-2">
                <Smartphone 
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    style={{ 
                        color: "var(--principal)"
                    }}
                />
                <span 
                    className="text-sm sm:text-base font-semibold"
                    style={{ 
                        color: "var(--principal)"
                    }}
                >
                    Transferencia
                </span>
            </div>
        </motion.button>
    );
}

