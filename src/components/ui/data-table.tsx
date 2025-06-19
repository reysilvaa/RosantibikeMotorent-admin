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
  const { isMobile } = useIsMobile();
  
  // Filter kolom yang tidak ditampilkan di mobile
  const visibleColumns = isMobile 
    ? columns.filter(column => !column.hideOnMobile)
    : columns;

  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              {visibleColumns.map((column, index) => (
                <th key={index} className={`px-2 py-3 md:px-4 ${column.className || ""}`}>
                  {column.header}
                </th>
              ))}
              {onRowClick && <th className="px-2 py-3 text-right md:px-4">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (onRowClick ? 1 : 0)}
                  className="px-2 py-8 text-center text-neutral-500 dark:text-neutral-400 md:px-4"
                >
                  <LoadingIndicator message="Memuat data..." />
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={String(item[keyField])}
                  className="border-b dark:border-neutral-800"
                >
                  {visibleColumns.map((column, index) => (
                    <td key={index} className={`px-2 py-3 md:px-4 ${column.className || ""}`}>
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                        ? String(item[column.accessorKey] || "")
                        : ""}
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="px-2 py-3 text-right md:px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onRowClick(item)}
                      >
                        <ExternalLink className="h-4 w-4" />
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
                  className="px-2 py-8 text-center text-neutral-500 dark:text-neutral-400 md:px-4"
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