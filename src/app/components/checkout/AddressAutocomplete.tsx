"use client";

import { MapPin, Edit2, Loader2, X } from "lucide-react";
import Input from "@/app/components/ui/Input";
import { useAddressAutocomplete } from "@/app/hooks/checkout/useAddressAutocomplete";
import type { IDireccionDTO } from "@/app/types/direccion.type";

export interface AddressAutocompleteProps {
  value?: string;
  onChange?: (direccion: IDireccionDTO | null) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
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
  const {
    searchQuery,
    suggestions,
    isLoading,
    showSuggestions,
    selectedAddress,
    isManualEdit,
    errorMessage,
    containerRef,
    inputRef,
    handleSelectSuggestion,
    handleInputChange,
    handleEnableManualEdit,
    handleClear,
    handleFocus,
  } = useAddressAutocomplete({
    value,
    onChange,
    onCityChange,
    onProvinceChange,
    onPostalCodeChange,
  });

  const displayError = error || errorMessage;

  return (
    <div ref={containerRef} className="relative w-full">
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
          onFocus={handleFocus}
        />
        <div
          className="absolute right-3 flex items-center gap-2 z-10"
          style={{
            top: label ? "calc(1.25rem + 0.375rem + 1.25rem)" : "1.25rem",
            transform: "translateY(-50%)",
          }}
        >
          {isLoading && (
            <Loader2 size={18} strokeWidth={2} className="animate-spin" style={{ color: "rgba(107, 114, 128, 0.7)" }} />
          )}
          {selectedAddress && !isManualEdit && (
            <button
              type="button"
              onClick={handleEnableManualEdit}
              className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              title="Editar manualmente"
              disabled={disabled}
              style={{ color: disabled ? "rgba(0, 0, 0, 0.3)" : "rgba(107, 114, 128, 0.7)" }}
            >
              <Edit2 size={18} strokeWidth={2} />
            </button>
          )}
          {searchQuery && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              title="Limpiar"
              style={{ color: "rgba(107, 114, 128, 0.7)" }}
            >
              <X size={18} strokeWidth={2} />
            </button>
          )}
        </div>
      </div>

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
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: "rgba(var(--principal-rgb), 0.8)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-gray-900 leading-tight">
                    {suggestion.direccion_formateada}
                  </p>
                  {suggestion.cod_postal && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5">CP {suggestion.cod_postal}</p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {selectedAddress && !isManualEdit && (
        <div className="mt-2 p-2.5 sm:p-3 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-green-700 font-medium">Dirección verificada</p>
          </div>
        </div>
      )}

      {selectedAddress && (
        <>
          <input type="hidden" name="direccion_formateada" value={selectedAddress.direccion_formateada || ""} />
          <input type="hidden" name="latitud" value={selectedAddress.latitud?.toString() || ""} />
          <input type="hidden" name="longitud" value={selectedAddress.longitud?.toString() || ""} />
        </>
      )}
    </div>
  );
}
