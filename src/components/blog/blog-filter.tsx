import React from 'react';
import { FilterButtons, FilterOption } from '@/components/ui/filter-buttons';
import { BlogStatus } from '@/lib/types/blog';

interface BlogFilterProps {
  currentValue: BlogStatus | '';
  onChange: (value: BlogStatus | '') => void;
}

export function BlogFilter({ currentValue, onChange }: BlogFilterProps) {
  const filterOptions: FilterOption<BlogStatus | ''>[] = [
    { value: '', label: 'Semua' },
    { value: BlogStatus.PUBLISHED, label: 'Terbit' },
    { value: BlogStatus.DRAFT, label: 'Draft' },
  ];

  return (
    <FilterButtons
      options={filterOptions}
      currentValue={currentValue}
      onChange={onChange}
    />
  );
}
