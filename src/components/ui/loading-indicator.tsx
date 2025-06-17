import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  size?: "small" | "medium" | "large";
  className?: string;
}

export function LoadingIndicator({
  message = "Memuat data...",
  size = "medium",
  className = "",
}: LoadingIndicatorProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const containerClasses = {
    small: "h-auto",
    medium: "h-96",
    large: "h-screen",
  };

  return (
    <div className={`flex items-center justify-center ${containerClasses[size]} ${className}`}>
      <div className="flex flex-col items-center space-y-2">
        <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
        {message && <span className="ml-2 text-neutral-700 dark:text-neutral-300">{message}</span>}
      </div>
    </div>
  );
} 