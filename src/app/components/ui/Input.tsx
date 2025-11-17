'use client';

import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { LucideIcon, Eye, EyeOff } from 'lucide-react';
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
        const [showPassword, setShowPassword] = useState<boolean>(false);
        const isPassword = props.type === 'password';

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

        const handleTogglePassword = () => {
            setShowPassword((prev) => !prev);
        };

        const displayError = error || validationError;
        const hasIcon = !!Icon;
        
        // Determinar el tipo de input
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : props.type;
        
        // Separar props para no sobrescribir el type cuando es password
        const { type, ...inputProps } = props;

        return (
            <div className="flex flex-col gap-1.5 w-full">
                {label && (
                    <label
                        className="text-sm font-medium transition-colors text-gray-700"
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

                    <input
                        ref={ref}
                        disabled={disabled}
                        onChange={handleChange}
                        type={inputType}
                        className={`
              w-full px-3 py-2.5 rounded-2xl
              bg-transparent
              text-sm
              transition-all duration-200
              placeholder:text-sm
              focus:outline-none
              ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
              ${(hasIcon && iconPosition === 'right') || isPassword ? 'pr-10' : ''}
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
                        {...inputProps}
                    />

                    {isPassword && (
                        <button
                            type="button"
                            onClick={handleTogglePassword}
                            disabled={disabled}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed z-10"
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                            style={{
                                color: displayError
                                    ? 'rgb(239, 68, 68)'
                                    : disabled
                                        ? 'rgba(0, 0, 0, 0.3)'
                                        : 'rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            {showPassword ? (
                                <EyeOff size={18} strokeWidth={2} />
                            ) : (
                                <Eye size={18} strokeWidth={2} />
                            )}
                        </button>
                    )}
                    {hasIcon && iconPosition === 'right' && !isPassword && (
                        <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10"
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