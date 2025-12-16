'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        label,
        error,
        icon: Icon,
        iconPosition = 'left',
        className = '',
        disabled,
        ...props
    }, ref) => {
        const displayError = error;
        const hasIcon = !!Icon;

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
                            className="absolute left-3 top-3 pointer-events-none z-10"
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

                    <textarea
                        ref={ref}
                        disabled={disabled}
                        className={`
                            w-full px-3 py-2.5 rounded-2xl
                            bg-transparent
                            text-sm
                            transition-all duration-200
                            placeholder:text-sm
                            focus:outline-none
                            resize-none
                            ${hasIcon && iconPosition === 'left' ? 'pl-10' : ''}
                            ${hasIcon && iconPosition === 'right' ? 'pr-10' : ''}
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
                    />

                    {hasIcon && iconPosition === 'right' && (
                        <div
                            className="absolute right-3 top-3 pointer-events-none z-10"
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

Textarea.displayName = 'Textarea';

export default Textarea;

