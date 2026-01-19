'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface MetodoPagoMercadoPagoProps {
    isSelected: boolean;
    onClick: () => void;
}

export function MetodoPagoMercadoPago({ isSelected, onClick }: MetodoPagoMercadoPagoProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-300"
            style={{
                backgroundColor: isSelected 
                    ? "rgba(var(--mercadopago-rgb), 0.15)" 
                    : "rgba(var(--mercadopago-rgb), 0.08)",
                borderColor: isSelected 
                    ? "var(--mercadopago)" 
                    : "rgba(var(--mercadopago-rgb), 0.3)",
                boxShadow: isSelected
                    ? "0 4px 12px rgba(var(--mercadopago-rgb), 0.2)"
                    : "0 2px 8px rgba(var(--mercadopago-rgb), 0.1)",
            }}
        >
            <div className="flex items-center justify-center w-full h-full">
                <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 relative flex-shrink-0"
                >
                    <Image
                        src="/logos/mp-logo.png"
                        alt="Mercado Pago"
                        className="object-contain"
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                    />
                </div>
            </div>
        </motion.button>
    );
}

