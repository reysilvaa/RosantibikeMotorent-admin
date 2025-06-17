import React from "react";
import { Search, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
  placeholder?: string;
  title?: string;
  showTitle?: boolean;
  className?: string;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
  onReset,
  placeholder = "Cari...",
  title,
  showTitle = false,
  className = "",
}: SearchBarProps) {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`}>
      {showTitle && title && <CardTitle>{title}</CardTitle>}
      
      <form
        onSubmit={onSearch}
        className="flex w-full items-center space-x-2 sm:w-auto"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" variant="default">
          Cari
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
        >
          <RefreshCcw className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Reset</span>
        </Button>
      </form>
    </div>
  );
} 