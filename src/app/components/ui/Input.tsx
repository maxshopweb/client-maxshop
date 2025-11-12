'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { z } from 'zod';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    schema?: z.ZodString | z.ZodNumber;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({
        label,
        error,
        icon: Icon,
        iconPosition = 'left',
        schema,
        className = '',
        disabled,
        onChange,
        ...props
    }, ref) => {
        const [validationError, setValidationError] = useState<string>('');

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (schema) {
                try {
                    schema.parse(e.target.value);
                    setValidationError('');
                } catch (err) {
                    if (err instanceof z.ZodError) {
                        setValidationError(err.issues[0]?.message || 'Entrada inválida');
                    }
                }
            }

            onChange?.(e);
        };

        const displayError = error || validationError;
        const hasIcon = !!Icon;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        className="text-sm font-medium transition-colors"
                        style={{
                            color: displayError
                                ? 'rgb(239, 68, 68)'
                                : 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.85)'
                        }}
                    >
                        {label}
                    </label>
                )}

                <div className="relative">
                    {hasIcon && iconPosition === 'left' && (
                        <div
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                                color: displayError
                                    ? 'rgb(239, 68, 68)'
                                    : disabled
                                        ? 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.3)'
                                        : 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.5)'
                            }}
                        >
                            <Icon size={18} strokeWidth={2} />
                        </div>
                    )}

                    <input
                        ref={ref}
                        disabled={disabled}
                        onChange={handleChange}
                        className={`
              w-full px-3 py-2.5 rounded-2xl
              bg-transparent
              text-sm
              transition-all duration-200
              placeholder:text-sm
              focus:outline-none
              ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
              ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
              ${disabled ? 'cursor-not-allowed' : ''}
              ${className}
            `}
                        style={{
                            color: disabled
                                ? 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.4)'
                                : 'var(--foreground)',
                            border: displayError
                                ? '1.5px solid rgb(239, 68, 68)'
                                : '1.5px solid rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.2)',
                            ...(disabled && {
                                backgroundColor: 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.02)'
                            })
                        }}
                        onFocus={(e) => {
                            if (!displayError && !disabled) {
                                e.target.style.borderColor = 'rgba(var(--principal-rgb), 0.6)';
                            }
                        }}
                        onBlur={(e) => {
                            if (!displayError) {
                                e.target.style.borderColor = 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.2)';
                            }
                        }}
                        {...props}
                    />

                    {hasIcon && iconPosition === 'right' && (
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                                color: displayError
                                    ? 'rgb(239, 68, 68)'
                                    : disabled
                                        ? 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.3)'
                                        : 'rgba(var(--foreground-rgb, var(--terciario-rgb)), 0.5)'
                            }}
                        >
                            <Icon size={18} strokeWidth={2} />
                        </div>
                    )}
                </div>

                {displayError && (
                    <span className="text-xs text-error mt-0.5">
                        {displayError}
                    </span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;