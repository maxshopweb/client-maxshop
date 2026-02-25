"use client";

import { useState, useEffect, useRef } from "react";
import type { IProductos } from "@/app/types/producto.type";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useProductSearch } from "./hooks/useProductSearch";
import SearchResultsDropdown from "./SearchResultsDropdown";

interface NavbarSearchContainerProps {
  products: IProductos[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  children: React.ReactNode;
  maxResults?: number;
  debounceDelay?: number;
  isLoading?: boolean;
}

export default function NavbarSearchContainer({
  products,
  searchQuery,
  onSearchChange,
  children,
  maxResults = 6,
  debounceDelay = 300,
  isLoading = false,
}: NavbarSearchContainerProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebouncedValue(searchQuery, debounceDelay);

  const { results, hasResults } = useProductSearch({
    query: debouncedQuery,
    products,
  });

  // Mostrar dropdown cuando hay query y (hay resultados o está cargando)
  useEffect(() => {
    if (debouncedQuery.trim().length > 0 && (hasResults || isLoading)) {
      setIsDropdownVisible(true);
    } else if (debouncedQuery.trim().length === 0 || (!hasResults && !isLoading)) {
      setIsDropdownVisible(false);
    }
  }, [debouncedQuery, hasResults, isLoading]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    if (isDropdownVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownVisible]);

  const handleClose = () => {
    setIsDropdownVisible(false);
  };

  return (
    <div ref={containerRef} className="relative">
      {children}
      <SearchResultsDropdown
        results={results}
        isVisible={isDropdownVisible}
        searchQuery={debouncedQuery}
        maxResults={maxResults}
        onClose={handleClose}
        isLoading={isLoading}
      />
    </div>
  );
}
