'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, LucideIcon } from 'lucide-react';

export interface ComboboxOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string | number;
    onChange?: (value: string | number | null) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    icon?: LucideIcon;
    iconPosition?: 'left' | 'right';
    searchable?: boolean;
    disabled?: boolean;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = "Buscar o seleccionar...",
    label,
    error,
    icon: Icon,
    iconPosition = 'left',
    searchable = true,
    disabled = false,
}: ComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = searchable && searchTerm
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (option: ComboboxOption) => {
        if (option.disabled) return;
        onChange?.(option.value);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.(null);
        setSearchTerm('');
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

            <div className="relative" ref={containerRef}>
                {Icon && iconPosition === 'left' && (
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

                <button
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`
                        w-full px-3 py-2.5 rounded-2xl
                        text-sm
                        transition-all duration-200
                        focus:outline-none
                        text-left
                        flex items-center justify-between
                        ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
                        pr-10
                        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
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
                >
                    <span className={selectedOption ? 'text-foreground' : 'text-gray-400'}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center gap-1">
                        {selectedOption && !disabled && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-0.5 hover:bg-gray-200 rounded"
                                style={{ color: 'rgba(107, 114, 128, 0.7)' }}
                            >
                                <span className="text-xs">×</span>
                            </button>
                        )}
                        <ChevronDown
                            size={18}
                            strokeWidth={2}
                            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            style={{
                                color: displayError
                                    ? 'rgb(239, 68, 68)'
                                    : disabled
                                        ? 'rgba(0, 0, 0, 0.3)'
                                        : 'rgba(0, 0, 0, 0.5)'
                            }}
                        />
                    </div>
                </button>

                {isOpen && (
                    <div
                        className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto"
                        style={{ top: '100%' }}
                    >
                        {searchable && (
                            <div className="p-2 border-b border-gray-200 sticky top-0 bg-white">
                                <div className="relative">
                                    <Search
                                        size={16}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar..."
                                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-principal"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="py-1">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        disabled={option.disabled}
                                        className={`
                                            w-full px-3 py-2 text-sm text-left
                                            flex items-center justify-between
                                            hover:bg-gray-100
                                            transition-colors
                                            ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                            ${value === option.value ? 'bg-principal/10' : ''}
                                        `}
                                    >
                                        <span>{option.label}</span>
                                        {value === option.value && (
                                            <Check size={16} className="text-principal" />
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>
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

