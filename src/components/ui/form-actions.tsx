import React from "react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  isLoading?: boolean;
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function FormActions({
  isLoading = false,
  onCancel,
  onSubmit,
  cancelLabel = "Batal",
  submitLabel = "Simpan",
  submitIcon,
  className = "",
  fullWidth = false
}: FormActionsProps) {
  return (
    <div className={`flex justify-end gap-3 ${className} ${fullWidth ? "col-span-full" : ""}`}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
      )}
      <Button 
        type={onSubmit ? "button" : "submit"} 
        disabled={isLoading}
        onClick={onSubmit}
      >
        {isLoading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800"></div>
            Memproses...
          </>
        ) : (
          <>
            {submitIcon && <span className="mr-2">{submitIcon}</span>}
            {submitLabel}
          </>
        )}
      </Button>
    </div>
  );
} 