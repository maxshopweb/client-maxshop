'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
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

type MenuPosition = { top: number; left: number; width: number; maxHeight: number };

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
    const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = searchable && searchTerm
        ? options.filter(opt =>
            opt.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    const updateMenuPosition = useCallback(() => {
        const el = triggerRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const gap = 4;
        const preferredMax = 280;
        const spaceBelow = window.innerHeight - rect.bottom - gap - 12;
        const maxHeight = Math.min(preferredMax, Math.max(100, spaceBelow));
        setMenuPosition({
            top: rect.bottom + gap,
            left: rect.left,
            width: rect.width,
            maxHeight,
        });
    }, []);

    useLayoutEffect(() => {
        if (!isOpen) {
            setMenuPosition(null);
            return;
        }
        updateMenuPosition();
        window.addEventListener('scroll', updateMenuPosition, true);
        window.addEventListener('resize', updateMenuPosition);
        return () => {
            window.removeEventListener('scroll', updateMenuPosition, true);
            window.removeEventListener('resize', updateMenuPosition);
        };
    }, [isOpen, updateMenuPosition]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const t = event.target as Node;
            if (containerRef.current?.contains(t)) return;
            if (menuRef.current?.contains(t)) return;
            setIsOpen(false);
            setSearchTerm('');
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && searchable && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen, searchable, menuPosition]);

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

    const menuContent =
        isOpen && menuPosition && typeof document !== 'undefined'
            ? createPortal(
                <div
                    ref={menuRef}
                    className="fixed flex flex-col rounded-lg shadow-lg border border-gray-200 bg-white overflow-hidden"
                    style={{
                        top: menuPosition.top,
                        left: menuPosition.left,
                        width: menuPosition.width,
                        maxHeight: menuPosition.maxHeight,
                        zIndex: 130,
                    }}
                >
                    {searchable && (
                        <div className="p-2 border-b border-gray-200 shrink-0 bg-white">
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

                    <div className="flex-1 min-h-0 overflow-y-auto py-1 overscroll-contain">
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
                </div>,
                document.body
            )
            : null;

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
                    ref={triggerRef}
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`
                        w-full px-3 py-2.5 rounded-2xl
                        text-sm
                        transition-all duration-200
                        focus:outline-none
                        text-left
                        flex items-center justify-between gap-2
                        ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
                        ${selectedOption && !disabled ? 'pr-16' : 'pr-10'}
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
                    <span
                        className={`min-w-0 flex-1 truncate ${selectedOption ? 'text-foreground' : 'text-gray-400'}`}
                    >
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown
                        size={18}
                        strokeWidth={2}
                        className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        style={{
                            color: displayError
                                ? 'rgb(239, 68, 68)'
                                : disabled
                                    ? 'rgba(0, 0, 0, 0.3)'
                                    : 'rgba(0, 0, 0, 0.5)'
                        }}
                    />
                </button>
                {selectedOption && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-9 top-1/2 z-10 -translate-y-1/2 rounded p-0.5 hover:bg-gray-200"
                        style={{ color: 'rgba(107, 114, 128, 0.7)' }}
                        aria-label="Limpiar selección"
                    >
                        <span className="text-xs leading-none">×</span>
                    </button>
                )}
            </div>

            {menuContent}

            {displayError && (
                <span className="text-xs text-error mt-0.5">
                    {displayError}
                </span>
            )}
        </div>
    );
}
