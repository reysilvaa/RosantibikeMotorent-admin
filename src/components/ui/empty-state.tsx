import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHandler?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHandler,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex h-96 items-center justify-center rounded-lg border border-dashed p-8 text-center ${className}`}
    >
      <div>
        {Icon && <Icon className="mx-auto h-10 w-10 text-neutral-400" />}
        <h3 className="mt-4 text-sm font-medium text-neutral-900 dark:text-neutral-50">
          {title}
        </h3>
        <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
        {actionLabel && actionHandler && (
          <Button onClick={actionHandler} className="mt-4" size="sm">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
