import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoadingIndicator } from "./loading-indicator";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  icon?: React.ReactNode;
  isMainField?: boolean;
}

interface MobileDataListProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onItemClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}

export function MobileDataList<T>({
  data,
  columns,
  keyField,
  onItemClick,
  emptyMessage = "Tidak ada data",
  isLoading = false,
  className = "",
}: MobileDataListProps<T>) {
  // Identifikasi kolom utama untuk header
  const mainColumn = columns.find(col => col.isMainField) || columns[0];
  
  if (isLoading) {
    return <LoadingIndicator message="Memuat data..." />;
  }

  if (data.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item) => (
        <div
          key={String(item[keyField])}
          className={cn(
            "bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm",
            "transition-all duration-150 active:scale-[0.98] active:bg-neutral-50",
            onItemClick ? "cursor-pointer" : ""
          )}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        >
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
            <div className="font-medium">
              {mainColumn.cell
                ? mainColumn.cell(item)
                : mainColumn.accessorKey
                ? String(item[mainColumn.accessorKey] || "")
                : ""}
            </div>
            {onItemClick && (
              <Button
                variant="ghost"
                size="xs"
                className="h-7 w-7 p-0 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onItemClick(item);
                }}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Detail</span>
              </Button>
            )}
          </div>
          
          <div className="p-3 divide-y divide-neutral-100 dark:divide-neutral-800">
            {columns
              .filter(col => col !== mainColumn)
              .map((column, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-3",
                    index === 0 ? "pt-0" : ""
                  )}
                >
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                    {column.icon && <span className="opacity-70">{column.icon}</span>}
                    <span>{column.header}</span>
                  </div>
                  <div className="text-sm text-right font-medium">
                    {column.cell
                      ? column.cell(item)
                      : column.accessorKey
                      ? String(item[column.accessorKey] || "")
                      : ""}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
} 