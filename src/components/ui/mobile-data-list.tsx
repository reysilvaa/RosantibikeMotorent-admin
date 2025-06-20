import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoadingIndicator } from './loading-indicator';

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
  emptyMessage = 'Tidak ada data',
  isLoading = false,
  className = '',
}: MobileDataListProps<T>) {
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
    <div className={cn('space-y-3', className)}>
      {data.map(item => (
        <div
          key={String(item[keyField])}
          className={cn(
            'overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800',
            'transition-all duration-150 active:scale-[0.98] active:bg-neutral-50',
            onItemClick ? 'cursor-pointer' : ''
          )}
          onClick={onItemClick ? () => onItemClick(item) : undefined}
        >
          <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/80">
            <div className="font-medium">
              {mainColumn.cell
                ? mainColumn.cell(item)
                : mainColumn.accessorKey
                  ? String(item[mainColumn.accessorKey] || '')
                  : ''}
            </div>
            {onItemClick && (
              <Button
                variant="ghost"
                size="xs"
                className="h-7 w-7 rounded-full p-0"
                onClick={e => {
                  e.stopPropagation();
                  onItemClick(item);
                }}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Detail</span>
              </Button>
            )}
          </div>

          <div className="divide-y divide-neutral-100 p-3 dark:divide-neutral-800">
            {columns
              .filter(col => col !== mainColumn)
              .map((column, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0',
                    index === 0 ? 'pt-0' : ''
                  )}
                >
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {column.icon && (
                      <span className="opacity-70">{column.icon}</span>
                    )}
                    <span>{column.header}</span>
                  </div>
                  <div className="text-right text-sm font-medium">
                    {column.cell
                      ? column.cell(item)
                      : column.accessorKey
                        ? String(item[column.accessorKey] || '')
                        : ''}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
