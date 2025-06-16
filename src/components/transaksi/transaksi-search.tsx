import { Search, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardTitle } from "@/components/ui/card";

interface TransaksiSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleResetFilter: () => void;
}

export function TransaksiSearch({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleResetFilter,
}: TransaksiSearchProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <CardTitle>Transaksi</CardTitle>
      <form
        onSubmit={handleSearch}
        className="flex w-full items-center space-x-2 sm:w-auto"
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <Input
            type="search"
            placeholder="Cari nama atau nomor HP..."
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
          onClick={handleResetFilter}
        >
          <RefreshCcw className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Reset</span>
        </Button>
      </form>
    </div>
  );
} 