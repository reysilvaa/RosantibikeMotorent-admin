import React from "react";
import { Button } from "@/components/ui/button";

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
  allLabel = "Semua",
  className = "",
  showAllOption = true,
}: FilterButtonsProps<T>) {
  return (
    <div className={`mb-4 flex flex-wrap items-center gap-2 ${className}`}>
      {showAllOption && (
        <Button
          variant={currentValue === options[0].value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(options[0].value)}
        >
          {allLabel}
        </Button>
      )}
      
      {options.slice(showAllOption ? 1 : 0).map((option, index) => (
        <Button
          key={`filter-${index}`}
          variant={currentValue === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
} 