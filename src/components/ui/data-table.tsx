import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
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
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full whitespace-nowrap text-left">
        <thead>
          <tr className="border-b text-sm font-medium text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            {columns.map((column, index) => (
              <th key={index} className={`px-4 py-3 ${column.className || ""}`}>
                {column.header}
              </th>
            ))}
            {onRowClick && <th className="px-4 py-3 text-right">Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length + (onRowClick ? 1 : 0)}
                className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
              >
                Memuat data...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item) => (
              <tr
                key={String(item[keyField])}
                className="border-b text-sm dark:border-neutral-800"
              >
                {columns.map((column, index) => (
                  <td key={index} className={`px-4 py-3 ${column.className || ""}`}>
                    {column.cell
                      ? column.cell(item)
                      : column.accessorKey
                      ? String(item[column.accessorKey] || "")
                      : ""}
                  </td>
                ))}
                {onRowClick && (
                  <td className="px-4 py-3 text-right">
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
                colSpan={columns.length + (onRowClick ? 1 : 0)}
                className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}