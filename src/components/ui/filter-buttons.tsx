import React from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

export interface FilterOption<T> {
  value: T;
  label: string;
}

interface FilterButtonsProps<T> {
  options: FilterOption<T>[];
  currentValue: T;
  onChange: (value: T) => void;
  allLabel?: string;
  className?: string;
  showAllOption?: boolean;
}

export function FilterButtons<T>({
  options,
  currentValue,
  onChange,
  allLabel = 'Semua',
  className = '',
  showAllOption = true,
}: FilterButtonsProps<T>) {
  const { isSmallMobile } = useIsMobile();

  return (
    <div className={cn('mb-3 flex flex-wrap items-center gap-1.5', className)}>
      {showAllOption && (
        <Button
          variant={currentValue === options[0].value ? 'default' : 'outline'}
          size={isSmallMobile ? 'xs' : 'sm'}
          className={cn(isSmallMobile && 'h-7 px-2 text-xs')}
          onClick={() => onChange(options[0].value)}
        >
          {allLabel}
        </Button>
      )}

      {options.slice(showAllOption ? 1 : 0).map((option, index) => (
        <Button
          key={`filter-${index}`}
          variant={currentValue === option.value ? 'default' : 'outline'}
          size={isSmallMobile ? 'xs' : 'sm'}
          className={cn(isSmallMobile && 'h-7 px-2 text-xs')}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
