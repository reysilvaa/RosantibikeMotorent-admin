import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/useIsMobile';

interface InfoItem {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
}

interface InfoCardProps {
  title: string;
  items: InfoItem[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function InfoCard({
  title,
  items,
  className = '',
  columns = 1,
  isLoading = false,
  emptyMessage = 'Tidak ada data',
}: InfoCardProps) {
  const { isMobile } = useIsMobile();

  const effectiveColumns = isMobile ? (Math.min(columns, 2) as 1 | 2) : columns;

  const gridCols = {
    1: '',
    2: 'grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader className="px-4 py-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-4 md:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700"></div>
            <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="px-4 py-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-4 md:px-6">
          <p className="text-neutral-500 dark:text-neutral-400">
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="px-4 py-4 md:px-6">
        <CardTitle className="text-lg md:text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4 md:px-6">
        <div className={`grid gap-4 ${gridCols[effectiveColumns]}`}>
          {items.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center text-sm text-neutral-500 md:text-base dark:text-neutral-400">
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
              </div>
              <div className="text-base font-medium md:text-lg">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
