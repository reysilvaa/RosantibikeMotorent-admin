import React from "react";
import { FilterButtons, FilterOption } from "@/components/ui/filter-buttons";
import { BlogStatus } from "@/lib/types/blog";

interface BlogFilterProps {
  currentValue: BlogStatus | "";
  onChange: (value: BlogStatus | "") => void;
  className?: string;
}

export function BlogFilter({
  currentValue,
  onChange,
  className = "",
}: BlogFilterProps) {
  const options: FilterOption<BlogStatus | "">[] = [
    { value: "", label: "Semua" },
    { value: BlogStatus.PUBLISHED, label: "Terbit" },
    { value: BlogStatus.DRAFT, label: "Draft" },
  ];

  return (
    <FilterButtons
      options={options}
      currentValue={currentValue}
      onChange={onChange}
      className={className}
    />
  );
} 