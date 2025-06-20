import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export function StatusBadge({
  status,
  variant = 'primary',
  className = '',
  size = 'medium',
}: StatusBadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/30';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/30';
      case 'danger':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/30';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30';
      case 'neutral':
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800/30';
      case 'primary':
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-2 py-0.5 text-xs';
      case 'large':
        return 'px-3 py-1 text-sm';
      case 'medium':
      default:
        return 'px-2.5 py-0.5 text-xs';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {status}
    </span>
  );
}
