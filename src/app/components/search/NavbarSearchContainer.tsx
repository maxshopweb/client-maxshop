"use client";

import { useState, useEffect, useRef, useId } from "react";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { useProductSearchSuggestions } from "./hooks/useProductSearchSuggestions";
import SearchResultsDropdown from "./SearchResultsDropdown";
import { isSearchQueryActive } from "@/app/utils/catalog-search.utils";

interface NavbarSearchContainerProps {
  searchQuery: string;
  onSubmitSearch?: (query: string) => void;
  children: (props: {
    onSubmitSearch: (query: string) => void;
    isDropdownVisible: boolean;
    resultsListId: string;
  }) => React.ReactNode;
  maxResults?: number;
  debounceDelay?: number;
}

export default function NavbarSearchContainer({
  searchQuery,
  onSubmitSearch,
  children,
  maxResults = 6,
  debounceDelay = 300,
}: NavbarSearchContainerProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resultsListId = useId();
  const debouncedQuery = useDebouncedValue(searchQuery, debounceDelay);

  const { results, isLoading, trimmedQuery } = useProductSearchSuggestions({
    query: debouncedQuery,
    enabled: isSearchQueryActive(searchQuery),
  });

  const isTyping = searchQuery.trim() !== debouncedQuery.trim();
  const showLoading = isLoading || isTyping;

  // Mostrar dropdown cuando hay query activa (con o sin resultados)
  useEffect(() => {
    if (isSearchQueryActive(searchQuery)) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [searchQuery]);

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

  const handleSubmitSearch = (query: string) => {
    onSubmitSearch?.(query);
    handleClose();
  };

  return (
    <div ref={containerRef} className="relative">
      {children({
        onSubmitSearch: handleSubmitSearch,
        isDropdownVisible,
        resultsListId,
      })}
      <SearchResultsDropdown
        results={results}
        isVisible={isDropdownVisible}
        searchQuery={trimmedQuery || searchQuery.trim()}
        maxResults={maxResults}
        onClose={handleClose}
        onSubmitSearch={handleSubmitSearch}
        isLoading={showLoading}
        resultsListId={resultsListId}
      />
    </div>
  );
}
