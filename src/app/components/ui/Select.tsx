'use client';

import React, { forwardRef, SelectHTMLAttributes, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export interface SelectOption {
    value: string | number;
    label: string;
    image?: string;
    disabled?: boolean;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    options: SelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    showImages?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ 
        options, 
        value, 
        onChange, 
        placeholder = "Seleccionar...", 
        disabled = false, 
        className = "",
        label,
        error,
        showImages = false,
        ...props 
    }, ref) => {
        const [isOpen, setIsOpen] = useState(false);

        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
            if (onChange) {
                const newValue = e.target.value;
                // Intentar convertir a número si es posible
                const parsedValue = !isNaN(Number(newValue)) && newValue !== '' 
                    ? Number(newValue) 
                    : newValue;
                onChange(parsedValue);
            }
            setIsOpen(false);
        };

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-[var(--white)] mb-2">
                        {label}
                    </label>
                )}
                
                <div className="relative group">
                    <select
                        ref={ref}
                        value={value ?? ''}
                        onChange={handleChange}
                        disabled={disabled}
                        onMouseDown={() => setIsOpen(!isOpen)}
                        onBlur={() => setIsOpen(false)}
                        className={clsx(
                            'w-full px-4 py-3 pr-10 rounded-lg text-sm font-medium transition-all duration-200 appearance-none',
                            'focus:outline-none focus:ring-2 focus:ring-principal/20 focus:shadow-sm',
                            'bg-background text-foreground border-2 border-input/70',
                            'hover:border-principal/50 focus:border-principal',
                            disabled && 'opacity-50 cursor-not-allowed',
                            error && 'ring-2 ring-destructive focus:ring-destructive border-destructive',
                            className
                        )}
                        style={{
                            backgroundColor: 'var(--background)',
                            color: 'var(--foreground)',
                        }}
                        {...props}
                    >
                        <option value="" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                disabled={option.disabled}
                                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    
                    <div className={clsx(
                        'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300',
                        isOpen && 'rotate-180',
                        disabled && 'opacity-50'
                    )}>
                        <ChevronDown className="w-4 h-4 text-foreground" />
                    </div>
                </div>

                {error && (
                    <p className="text-[var(--red)] text-xs mt-1.5 ml-1">{error}</p>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;