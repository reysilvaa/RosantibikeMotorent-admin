import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormActionsProps {
  isLoading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  submitIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function FormActions({
  isLoading = false,
  onCancel,
  submitLabel = "Simpan",
  cancelLabel = "Batal",
  submitIcon,
  fullWidth = false,
  className,
}: FormActionsProps) {
  return (
    <div className={cn("flex items-center gap-2", fullWidth ? "flex-col sm:flex-row" : "", className)}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className={cn(fullWidth && "w-full sm:w-auto")}
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className={cn(fullWidth && "w-full sm:w-auto")}
      >
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : submitIcon}
        {submitLabel}
      </Button>
    </div>
  );
} 