"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { locationService } from "@/app/services/location.service";
import type { IDireccionOpenCageDTO, IDireccionDTO } from "@/app/types/direccion.type";

export interface UseAddressAutocompleteProps {
  value?: string;
  onChange?: (direccion: IDireccionDTO | null) => void;
  onCityChange?: (ciudad: string) => void;
  onProvinceChange?: (provincia: string) => void;
  onPostalCodeChange?: (cod_postal: string) => void;
}

export function useAddressAutocomplete({
  value = "",
  onChange,
  onCityChange,
  onProvinceChange,
  onPostalCodeChange,
}: UseAddressAutocompleteProps) {
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
  const skipNextResultRef = useRef(false);

  useEffect(() => {
    if (selectedAddress && !isManualEdit) return;
    if (!debouncedQuery || debouncedQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    skipNextResultRef.current = false;
    let cancelled = false;
    setIsLoading(true);
    setErrorMessage(null);

    locationService
      .search({ q: debouncedQuery, limit: 5, country: "ar" })
      .then((results) => {
        if (cancelled || skipNextResultRef.current) return;
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage("Error al buscar direcciones. Podés continuar escribiendo manualmente.");
          setSuggestions([]);
          setShowSuggestions(false);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery, isManualEdit, selectedAddress]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value !== searchQuery && !selectedAddress) setSearchQuery(value);
  }, [value]);

  const handleSelectSuggestion = useCallback(
    (suggestion: IDireccionOpenCageDTO) => {
      skipNextResultRef.current = true;
      const dto: IDireccionDTO = {
        direccion_usuario: suggestion.direccion_formateada,
        direccion_formateada: suggestion.direccion_formateada,
        calle: suggestion.calle,
        numero: suggestion.numero,
        ciudad: suggestion.ciudad,
        provincia: suggestion.provincia,
        cod_postal: suggestion.cod_postal,
        pais: suggestion.pais || "Argentina",
        latitud: suggestion.latitud,
        longitud: suggestion.longitud,
      };
      setSelectedAddress(dto);
      setSearchQuery(suggestion.direccion_formateada);
      setShowSuggestions(false);
      setIsManualEdit(false);
      setSuggestions([]);
      if (suggestion.ciudad) onCityChange?.(suggestion.ciudad);
      if (suggestion.provincia) onProvinceChange?.(suggestion.provincia);
      if (suggestion.cod_postal) onPostalCodeChange?.(suggestion.cod_postal);
      setTimeout(() => onChange?.(dto), 50);
    },
    [onChange, onCityChange, onProvinceChange, onPostalCodeChange]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setSearchQuery(newValue);
      const wasSelected = selectedAddress && newValue !== selectedAddress.direccion_formateada;
      if (wasSelected) {
        setIsManualEdit(true);
        setSelectedAddress(null);
      }
      if (!selectedAddress || isManualEdit || wasSelected) {
        onChange?.({ direccion_usuario: newValue });
      }
    },
    [selectedAddress, isManualEdit, onChange]
  );

  const handleEnableManualEdit = useCallback(() => {
    setIsManualEdit(true);
    setSelectedAddress(null);
    onCityChange?.("");
    onProvinceChange?.("");
    onPostalCodeChange?.("");
  }, [onCityChange, onProvinceChange, onPostalCodeChange]);

  const handleClear = useCallback(() => {
    setSearchQuery("");
    setSelectedAddress(null);
    setIsManualEdit(false);
    setSuggestions([]);
    setShowSuggestions(false);
    onChange?.(null);
    onCityChange?.("");
    onProvinceChange?.("");
    onPostalCodeChange?.("");
    inputRef.current?.focus();
  }, [onChange, onCityChange, onProvinceChange, onPostalCodeChange]);

  const handleFocus = useCallback(() => {
    if (suggestions.length > 0 && !isManualEdit) setShowSuggestions(true);
  }, [suggestions.length, isManualEdit]);

  return {
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
  };
}
