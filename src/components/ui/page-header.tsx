import React from "react";
import { ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

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
          size={isMobile ? "icon" : "default"}
          className={actionHref && isMobile ? "p-2" : ""}
        >
          {actionLoading ? (
            <Loader2 className={`h-4 w-4 animate-spin ${!isMobile && actionLabel ? "mr-2" : ""}`} />
          ) : (
            actionIcon || (isMobile && <Plus className="h-4 w-4" />)
          )}
          {!isMobile && actionLabel}
          {isMobile && actionLabel && !actionIcon && <span className="sr-only">{actionLabel}</span>}
        </Button>
      )}
    </div>
  );
} 