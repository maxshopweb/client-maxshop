// components/ui/Select.tsx

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
                            'w-full px-6 py-4 pr-10 rounded-[20px] font-medium transition-all duration-200 appearance-none',
                            'focus:outline-none focus:ring-2 focus:ring-[var(--green)] focus:shadow-lg',
                            'bg-[var(--gray-400)] text-white',
                            'hover:bg-[#2a2a2a]',
                            disabled && 'opacity-50 cursor-not-allowed hover:bg-[var(--gray-400)]',
                            error && 'ring-2 ring-[var(--red)] focus:ring-[var(--red)]',
                            className
                        )}
                        {...props}
                    >
                        <option value="" className="bg-[#1e1e1e] text-white">
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option 
                                key={option.value} 
                                value={option.value}
                                disabled={option.disabled}
                                className="bg-[#1e1e1e] text-white hover:bg-[#333] py-2"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    
                    <div className={clsx(
                        'absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300',
                        isOpen && 'rotate-180',
                        disabled && 'opacity-50'
                    )}>
                        <ChevronDown className="w-4 h-4 text-white" />
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