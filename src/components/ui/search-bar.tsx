import React from 'react';
import { RefreshCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/useIsMobile';

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
  placeholder = 'Cari...',
  title,
  showTitle = false,
  className = '',
}: SearchBarProps) {
  const { isMobile } = useIsMobile();

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {showTitle && title && (
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
      )}

      <form
        onSubmit={onSearch}
        className="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            variant="default"
            className={isMobile ? 'flex-1' : ''}
          >
            Cari
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className={isMobile ? 'flex-1' : ''}
          >
            <RefreshCcw className="h-4 w-4" />
            <span
              className={isMobile ? 'ml-2' : 'sr-only sm:not-sr-only sm:ml-2'}
            >
              Reset
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
