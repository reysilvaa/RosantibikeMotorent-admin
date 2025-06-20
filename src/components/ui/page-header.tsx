import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';

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
  const { isMobile, isSmallMobile } = useIsMobile();

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
    <div className="flex w-full flex-wrap items-center justify-between gap-3 overflow-hidden">
      <div
        className={cn(
          'flex items-center',
          'max-w-full',
          actionLabel || actionIcon ? 'w-auto' : 'w-full'
        )}
      >
        {showBackButton && (
          <Button
            variant="outline"
            size="icon"
            className="mr-2 flex-shrink-0 md:mr-4"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Kembali</span>
          </Button>
        )}
        <div className="max-w-full min-w-0">
          <h2 className="truncate text-lg font-bold tracking-tight md:text-2xl lg:text-3xl">
            {title}
          </h2>
          {description && (
            <p className="truncate text-xs text-neutral-500 md:text-sm dark:text-neutral-400">
              {description}
            </p>
          )}
          {id && (
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
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
          size={isMobile && !actionLabel ? 'icon' : 'default'}
          className={cn(
            'flex-shrink-0',
            isSmallMobile && actionLabel ? 'h-8 px-2 py-1 text-xs' : '',
            isMobile && !isSmallMobile && actionLabel
              ? 'h-9 px-3 py-1.5 text-xs'
              : '',
            actionHref && isMobile && !actionLabel ? 'p-2' : ''
          )}
        >
          {actionLoading ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <span className={actionLabel ? 'mr-1.5' : ''}>
              {actionIcon || <Plus className="h-4 w-4" />}
            </span>
          )}
          {actionLabel && <span className="truncate">{actionLabel}</span>}
        </Button>
      )}
    </div>
  );
}
