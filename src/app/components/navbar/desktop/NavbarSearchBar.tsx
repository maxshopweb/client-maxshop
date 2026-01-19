"use client";

import { Search } from "lucide-react";

interface NavbarSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export default function NavbarSearchBar({
  searchQuery,
  onSearchChange,
}: NavbarSearchBarProps) {
  return (
    <div className="flex-1 mx-2 min-w-0 max-w-lg mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Busca productos..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-white/10 text-white placeholder-white/60 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60"
        />
      </div>
    </div>
  );
}

