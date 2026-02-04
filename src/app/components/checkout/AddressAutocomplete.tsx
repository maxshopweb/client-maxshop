"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { locationService } from "@/app/services/location.service";
import type { IDireccionOpenCageDTO, IDireccionDTO } from "@/app/types/direccion.type";
import { MapPin, Edit2, Loader2, X } from "lucide-react";
import Input from "@/app/components/ui/Input";

interface AddressAutocompleteProps {
    // Valor actual de la dirección (texto ingresado por usuario)
    value?: string;
    // Callback cuando cambia la dirección completa
    onChange?: (direccion: IDireccionDTO | null) => void;
    // Errores de validación
    error?: string;
    // Label del campo principal
    label?: string;
    // Placeholder
    placeholder?: string;
    // Disabled
    disabled?: boolean;
    // IDs de los campos relacionados para actualizar (ciudad, provincia, postalCode)
    onCityChange?: (ciudad: string) => void;
    onProvinceChange?: (provincia: string) => void;
    onPostalCodeChange?: (cod_postal: string) => void;
}

export default function AddressAutocomplete({
    value = "",
    onChange,
    error,
    label = "Dirección",
    placeholder = "Escribí tu dirección...",
    disabled = false,
    onCityChange,
    onProvinceChange,
    onPostalCodeChange,
}: AddressAutocompleteProps) {
    const [searchQuery, setSearchQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<IDireccionOpenCageDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<IDireccionDTO | null>(null);
    const [isManualEdit, setIsManualEdit] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const debouncedQuery = useDebounce(searchQuery, 500);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Buscar sugerencias cuando el usuario escribe
    useEffect(() => {
        const searchAddresses = async () => {
            // No buscar si hay una dirección seleccionada y no está en modo manual
            if (selectedAddress && !isManualEdit) {
                return;
            }

            if (!debouncedQuery || debouncedQuery.length < 3) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoading(true);
            setErrorMessage(null);

            try {
                const results = await locationService.search({
                    q: debouncedQuery,
                    limit: 5,
                    country: 'ar',
                });

                // Solo mostrar sugerencias si no hay dirección seleccionada
                if (!selectedAddress || isManualEdit) {
                    setSuggestions(results);
                    setShowSuggestions(results.length > 0);
                }
            } catch (err: any) {
                console.error('Error buscando direcciones:', err);
                setErrorMessage('Error al buscar direcciones. Podés continuar escribiendo manualmente.');
                setSuggestions([]);
                setShowSuggestions(false);
            } finally {
                setIsLoading(false);
            }
        };

        searchAddresses();
    }, [debouncedQuery, isManualEdit, selectedAddress]);

    // Cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Manejar selección de sugerencia
    const handleSelectSuggestion = useCallback((suggestion: IDireccionOpenCageDTO) => {
        const direccionDTO: IDireccionDTO = {
            direccion_usuario: suggestion.direccion_formateada,
            direccion_formateada: suggestion.direccion_formateada,
            calle: suggestion.calle,
            numero: suggestion.numero,
            ciudad: suggestion.ciudad,
            provincia: suggestion.provincia,
            cod_postal: suggestion.cod_postal,
            pais: suggestion.pais || 'Argentina',
            latitud: suggestion.latitud,
            longitud: suggestion.longitud,
        };

        // Actualizar estados de manera atómica
        setSelectedAddress(direccionDTO);
        setSearchQuery(suggestion.direccion_formateada);
        setShowSuggestions(false);
        setIsManualEdit(false);
        setSuggestions([]);

        // Actualizar campos relacionados
        if (suggestion.ciudad && onCityChange) {
            onCityChange(suggestion.ciudad);
        }
        if (suggestion.provincia && onProvinceChange) {
            onProvinceChange(suggestion.provincia);
        }
        if (suggestion.cod_postal && onPostalCodeChange) {
            onPostalCodeChange(suggestion.cod_postal);
        }

        // Notificar cambio después de un pequeño delay
        setTimeout(() => {
            onChange?.(direccionDTO);
        }, 50);
    }, [onChange, onCityChange, onProvinceChange, onPostalCodeChange]);

    // Manejar cambio manual del input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchQuery(newValue);

        // Si hay una dirección seleccionada y el usuario empieza a editar, activar modo manual
        if (selectedAddress && newValue !== selectedAddress.direccion_formateada) {
            setIsManualEdit(true);
            setSelectedAddress(null);
        }

        // Si está en modo manual o no hay selección, solo guardar lo que el usuario escribe
        if (!selectedAddress || isManualEdit) {
            const direccionManual: IDireccionDTO = {
                direccion_usuario: newValue,
            };
            onChange?.(direccionManual);
        }
    };

    // Habilitar edición manual
    const handleEnableManualEdit = () => {
        setIsManualEdit(true);
        setSelectedAddress(null);
        // Limpiar campos relacionados si es necesario
        if (onCityChange) onCityChange('');
        if (onProvinceChange) onProvinceChange('');
        if (onPostalCodeChange) onPostalCodeChange('');
    };

    // Limpiar selección
    const handleClear = () => {
        setSearchQuery('');
        setSelectedAddress(null);
        setIsManualEdit(false);
        setSuggestions([]);
        setShowSuggestions(false);
        onChange?.(null);
        if (onCityChange) onCityChange('');
        if (onProvinceChange) onProvinceChange('');
        if (onPostalCodeChange) onPostalCodeChange('');
        inputRef.current?.focus();
    };

    // Sincronizar value externo solo si cambia desde fuera (no por selección interna)
    useEffect(() => {
        // Solo actualizar si el valor externo cambió Y no hay una dirección seleccionada
        // Esto evita resetear el input después de seleccionar una dirección
        if (value !== searchQuery && !selectedAddress) {
            setSearchQuery(value);
        }
    }, [value]);

    const displayError = error || errorMessage;

    return (
        <div ref={containerRef} className="relative w-full">
            {/* Input principal */}
            <div className="relative">
                <Input
                    ref={inputRef}
                    label={label}
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    error={displayError || undefined}
                    icon={MapPin}
                    iconPosition="left"
                    onFocus={() => {
                        if (suggestions.length > 0 && !isManualEdit) {
                            setShowSuggestions(true);
                        }
                    }}
                />

                {/* Indicadores en el input */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isLoading && (
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: 'rgba(107, 114, 128, 0.7)' }} />
                    )}
                    {selectedAddress && !isManualEdit && (
                        <button
                            type="button"
                            onClick={handleEnableManualEdit}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Editar manualmente"
                        >
                            <Edit2 className="w-4 h-4" style={{ color: 'rgba(107, 114, 128, 0.7)' }} />
                        </button>
                    )}
                    {searchQuery && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Limpiar"
                        >
                            <X className="w-4 h-4" style={{ color: 'rgba(107, 114, 128, 0.7)' }} />
                        </button>
                    )}
                </div>
            </div>

            {/* Dropdown de sugerencias */}
            {showSuggestions && suggestions.length > 0 && !isManualEdit && !selectedAddress && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[280px] sm:max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={`${suggestion.direccion_formateada}-${index}`}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSelectSuggestion(suggestion);
                            }}
                            className="w-full text-left px-3 sm:px-4 py-3 sm:py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                        >
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex items-center justify-center">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'rgba(var(--principal-rgb), 0.8)' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm sm:text-base font-medium text-gray-900 leading-tight">
                                        {suggestion.direccion_formateada}
                                    </p>
                                    {suggestion.cod_postal && (
                                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                            CP {suggestion.cod_postal}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Mensaje informativo cuando hay una dirección seleccionada */}
            {selectedAddress && !isManualEdit && (
                <div className="mt-2 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-xs sm:text-sm text-green-700 font-medium">
                            Dirección verificada
                        </p>
                    </div>
                </div>
            )}

            {/* Campos ocultos para datos normalizados (se pueden usar con react-hook-form si es necesario) */}
            {selectedAddress && (
                <>
                    <input type="hidden" name="direccion_formateada" value={selectedAddress.direccion_formateada || ''} />
                    <input type="hidden" name="latitud" value={selectedAddress.latitud?.toString() || ''} />
                    <input type="hidden" name="longitud" value={selectedAddress.longitud?.toString() || ''} />
                </>
            )}
        </div>
    );
}

