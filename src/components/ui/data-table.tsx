import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { LoadingIndicator } from "./loading-indicator";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyField,
  onRowClick,
  emptyMessage = "Tidak ada data",
  isLoading = false,
  className = "",
}: DataTableProps<T>) {
  const { isMobile, isSmallMobile } = useIsMobile();
  
  // Filter kolom yang tidak ditampilkan di mobile
  const visibleColumns = isMobile 
    ? columns.filter(column => !column.hideOnMobile)
    : columns;

  return (
    <div className={`w-full ${className}`}>
      <div className="overflow-x-auto w-full custom-scrollbar">
        <table className="w-full text-left text-xs md:text-sm min-w-full table-fixed">
          <thead>
            <tr className="border-b font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              {visibleColumns.map((column, index) => (
                <th key={index} className={`px-1 py-2 md:px-4 md:py-3 ${column.className || ""}`} style={{ minWidth: '100px' }}>
                  {column.header}
                </th>
              ))}
              {onRowClick && <th className="px-1 py-2 text-right md:px-4 md:py-3" style={{ minWidth: '60px' }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (onRowClick ? 1 : 0)}
                  className="px-1 py-6 text-center text-neutral-500 dark:text-neutral-400 md:px-4 md:py-8"
                >
                  <LoadingIndicator message="Memuat data..." />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={String(item[keyField])}
                  className="border-b dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 cursor-pointer"
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                >
                  {visibleColumns.map((column, index) => (
                    <td key={index} className={`px-1 py-2 md:px-4 md:py-3 ${column.className || ""}`}>
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                        ? String(item[column.accessorKey] || "")
                        : ""}
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="px-1 py-2 text-right md:px-4 md:py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className={isSmallMobile ? "h-6 w-6 p-0" : "h-8 w-8 p-0"}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick(item);
                        }}
                      >
                        <ExternalLink className={isSmallMobile ? "h-3 w-3" : "h-4 w-4"} />
                        <span className="sr-only">Detail</span>
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={visibleColumns.length + (onRowClick ? 1 : 0)}
                  className="px-1 py-6 text-center text-neutral-500 dark:text-neutral-400 md:px-4 md:py-8"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}