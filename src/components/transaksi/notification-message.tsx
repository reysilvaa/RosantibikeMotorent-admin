import { AlertCircle, CheckCircle } from "lucide-react";

interface NotificationMessageProps {
  error?: string;
  success?: string;
}

export function NotificationMessage({ error, success }: NotificationMessageProps) {
  if (!error && !success) return null;
  
  return (
    <>
      {error && (
        <div className="flex items-center rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center rounded-lg bg-green-50 p-4 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle className="mr-2 h-5 w-5" />
          {success}
        </div>
      )}
    </>
  );
} 