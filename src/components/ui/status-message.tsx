import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface StatusMessageProps {
  error?: string;
  success?: string;
  className?: string;
}

export function StatusMessage({
  error,
  success,
  className = '',
}: StatusMessageProps) {
  if (!error && !success) return null;

  if (error) {
    return (
      <div
        className={`flex items-center rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400 ${className}`}
      >
        <AlertCircle className="mr-2 h-5 w-5" />
        {error}
      </div>
    );
  }

  if (success) {
    return (
      <div
        className={`flex items-center rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400 ${className}`}
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        {success}
      </div>
    );
  }

  return null;
}
