import React from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PageHeaderProps {
  title: string;
  description?: string;
  id?: string;
  backHref?: string;
  actionLabel?: string;
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
            className="mr-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
        )}
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          {description && (
            <p className="text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
          {id && (
            <p className="text-neutral-500 dark:text-neutral-400">
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
          className={actionHref ? "hidden sm:flex" : ""}
        >
          {actionLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            actionIcon
          )}
          {actionLabel}
        </Button>
      )}
    </div>
  );
} 