"use client";

import { Search } from "lucide-react";

interface MobileMenuSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmitSearch?: (query: string) => void;
  isDropdownVisible?: boolean;
  resultsListId?: string;
}

export default function MobileMenuSearch({
  searchQuery,
  onSearchChange,
  onSubmitSearch,
  isDropdownVisible = false,
  resultsListId,
}: MobileMenuSearchProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmitSearch?.(searchQuery);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="px-4 py-3 border-b border-white/20"
    >
      <div className="relative">
        <input
          type="search"
          placeholder="Busca productos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Buscar productos"
          aria-expanded={isDropdownVisible}
          aria-controls={resultsListId}
          aria-autocomplete="list"
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
        />
        <button
          type="submit"
          aria-label="Buscar en catálogo"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        >
          <Search size={18} />
        </button>
      </div>
    </form>
  );
}
