import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

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
  className = "",
  columns = 1,
  isLoading = false,
  emptyMessage = "Tidak ada data",
}: InfoCardProps) {
  const gridCols = {
    1: "",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-700 w-3/4"></div>
            <div className="h-4 rounded bg-neutral-200 dark:bg-neutral-700 w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500 dark:text-neutral-400">
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${gridCols[columns]}`}>
          {items.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
              </div>
              <div className="text-lg font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 