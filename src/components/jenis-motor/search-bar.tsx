"use client";

import React from "react";
import { Search, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  onReset: () => void;
}

export function SearchBar({
  searchQuery,
  setSearchQuery,
  onSearch,
  onReset,
}: SearchBarProps) {
  return (
    <form
      onSubmit={onSearch}
      className="flex w-full items-center space-x-2 sm:w-auto"
    >
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
        <Input
          type="search"
          placeholder="Cari merk atau model..."
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
  );
} 