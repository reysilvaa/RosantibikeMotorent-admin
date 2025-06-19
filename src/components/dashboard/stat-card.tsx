import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 py-3 md:px-5">
        <CardTitle className="text-xs font-medium text-neutral-500 dark:text-neutral-400 md:text-sm">
          {title}
        </CardTitle>
        <div className="rounded-full bg-neutral-100 p-1.5 md:p-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 md:px-5">
        <div className="text-xl font-bold md:text-2xl">{value}</div>
        {trend && trendValue && (
          <p
            className={`mt-1 flex items-center text-[10px] md:text-xs ${
              trend === "up"
                ? "text-green-600 dark:text-green-500"
                : "text-red-600 dark:text-red-500"
            }`}
          >
            {trend === "up" ? (
              <ArrowUpRight className="mr-1 h-3 w-3" />
            ) : (
              <ArrowUpRight className="mr-1 h-3 w-3 rotate-90" />
            )}
            {trendValue}
          </p>
        )}
      </CardContent>
    </Card>
  );
} 