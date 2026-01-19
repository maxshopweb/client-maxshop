"use client";

import { useEffect, useRef, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatCardProps {
    title: string;
    value: number | string;
    icon?: LucideIcon;
    iconColor?: string;
    formatValue?: (value: number) => string;
    duration?: number;
}

export function AnimatedStatCard({
    title,
    value,
    icon: Icon,
    iconColor = 'text-principal',
    formatValue,
    duration = 1500,
}: AnimatedStatCardProps) {
    const isStringValue = typeof value === 'string';
    const numericValue = typeof value === 'number' ? value : 0;
    
    const [displayValue, setDisplayValue] = useState(numericValue);
    const animationRef = useRef<number | null>(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (isStringValue) {
            setDisplayValue(numericValue);
            return;
        }

        // Si el valor cambió de 0 a un valor real, animar
        if (numericValue > 0 && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            setDisplayValue(0);

            const startTime = performance.now();
            const target = numericValue;

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = target * eased;
                
                setDisplayValue(current);

                if (progress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                } else {
                    setDisplayValue(target);
                    animationRef.current = null;
                }
            };

            animationRef.current = requestAnimationFrame(animate);
        } else if (numericValue > 0) {
            // Si ya animamos pero el valor cambió, actualizar directamente
            setDisplayValue(numericValue);
        } else {
            // Si el valor es 0, resetear
            setDisplayValue(0);
            hasAnimatedRef.current = false;
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [numericValue, duration, isStringValue]);

    const getDisplayText = () => {
        if (isStringValue) {
            return value;
        }
        if (formatValue) {
            return formatValue(displayValue);
        }
        return Math.floor(displayValue).toLocaleString();
    };

    return (
        <div className="bg-card border border-card p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">{title}</h3>
                {Icon && (
                    <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
                )}
            </div>
            <p className="text-2xl font-bold text-principal">
                {getDisplayText()}
            </p>
        </div>
    );
}
