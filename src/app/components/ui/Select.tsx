'use client';

import React, { forwardRef, SelectHTMLAttributes, useState } from 'react';
import { ChevronDown, LucideIcon } from 'lucide-react';

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
    helperText?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
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
        helperText,
        icon: Icon,
        iconPosition = 'left',
        ...props 
    }, ref) => {
        const [isOpen, setIsOpen] = useState(false);
        const hasIcon = !!Icon;

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

        const displayError = error;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        className="text-sm font-medium transition-colors"
                        style={{
                            color: displayError
                                ? 'rgb(239, 68, 68)'
                                : 'rgb(55, 65, 81)'
                        }}
                    >
                        {label}
                    </label>
                )}
                
                <div className="relative">
                    {hasIcon && iconPosition === 'left' && (
                        <div
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                            style={{
                                color: displayError
                                    ? 'rgb(239, 68, 68)'
                                    : disabled
                                        ? 'rgba(107, 114, 128, 0.4)'
                                        : 'rgba(107, 114, 128, 0.7)'
                            }}
                        >
                            <Icon size={18} strokeWidth={2} />
                        </div>
                    )}

                    <select
                        ref={ref}
                        value={value != null ? String(value) : ''}
                        onChange={handleChange}
                        disabled={disabled}
                        onMouseDown={() => setIsOpen(!isOpen)}
                        onBlur={() => setIsOpen(false)}
                        className={`
                            w-full px-3 py-2.5 rounded-2xl
                            bg-transparent
                            text-sm
                            transition-all duration-200
                            placeholder:text-sm
                            focus:outline-none
                            appearance-none
                            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
                            pr-10
                            ${disabled ? 'cursor-not-allowed' : ''}
                            ${className}
                        `}
                        style={{
                            color: disabled
                                ? 'rgba(0, 0, 0, 0.4)'
                                : 'rgb(17, 24, 39)',
                            border: displayError
                                ? '1.5px solid rgb(239, 68, 68)'
                                : '1.5px solid rgba(0, 0, 0, 0.15)',
                            backgroundColor: disabled
                                ? 'rgba(0, 0, 0, 0.02)'
                                : 'rgba(255, 255, 255, 1)'
                        }}
                        onFocus={(e) => {
                            if (!displayError && !disabled) {
                                e.target.style.borderColor = 'rgba(var(--principal-rgb), 0.6)';
                            }
                        }}
                        onBlur={(e) => {
                            if (!displayError) {
                                e.target.style.borderColor = 'rgba(0, 0, 0, 0.15)';
                            }
                        }}
                        {...props}
                    >
                        <option value="" style={{ backgroundColor: 'rgba(255, 255, 255, 1)', color: 'rgb(107, 114, 128)' }}>
                            {placeholder}
                        </option>
                        {options.map((option) => (
                            <option 
                                key={String(option.value)} 
                                value={String(option.value)}
                                disabled={option.disabled}
                                style={{ backgroundColor: 'rgba(255, 255, 255, 1)', color: 'rgb(17, 24, 39)' }}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    
                    <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 z-10"
                        style={{
                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                            opacity: disabled ? 0.5 : 1
                        }}
                    >
                        <ChevronDown 
                            size={18} 
                            strokeWidth={2}
                            style={{
                                color: displayError
                                    ? 'rgb(239, 68, 68)'
                                    : disabled
                                        ? 'rgba(0, 0, 0, 0.3)'
                                        : 'rgba(0, 0, 0, 0.5)'
                            }}
                        />
                    </div>
                </div>

                {displayError && (
                    <span className="text-xs text-error mt-0.5">
                        {displayError}
                    </span>
                )}
                {!displayError && helperText && (
                    <span className="text-xs text-foreground/60 mt-0.5">
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);

Select.displayName = 'Select';

export default Select;