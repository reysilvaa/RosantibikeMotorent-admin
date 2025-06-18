import React from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  id?: string;
  backHref?: string;
  actionLabel?: string | undefined;
  actionIcon?: React.ReactNode;
  actionHref?: string;
  actionHandler?: () => void;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  showBackButton?: boolean;
}

export function PageHeader({
  title,
  description,
  id,
  backHref,
  actionLabel,
  actionIcon,
  actionHref,
  actionHandler,
  actionDisabled = false,
  actionLoading = false,
  showBackButton = false,
}: PageHeaderProps) {
  const router = useRouter();
  const { isMobile } = useIsMobile();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const handleAction = () => {
    if (actionHandler) {
      actionHandler();
    } else if (actionHref) {
      router.push(actionHref);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {showBackButton && (
          <Button
            variant="outline"
            size="icon"
            className="mr-3 md:mr-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
        )}
        <div>
          <h2 className="text-xl font-bold tracking-tight md:text-3xl">{title}</h2>
          {description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 md:text-base">
              {description}
            </p>
          )}
          {id && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 md:text-sm">
              ID: {id}
            </p>
          )}
        </div>
      </div>
      
      {(actionLabel || actionIcon) && (
        <Button
          variant="default"
          onClick={handleAction}
          disabled={actionDisabled}
          size={isMobile && !actionLabel ? "icon" : "default"}
          className={cn(
            isMobile && actionLabel ? "text-xs px-3 py-1.5 h-9" : "",
            actionHref && isMobile && !actionLabel ? "p-2" : ""
          )}
        >
          {actionLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
          ) : (
            <span className={actionLabel ? "mr-1.5" : ""}>
              {actionIcon || <Plus className="h-4 w-4" />}
            </span>
          )}
          {actionLabel && <span>{actionLabel}</span>}
        </Button>
      )}
    </div>
  );
} 