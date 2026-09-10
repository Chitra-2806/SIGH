import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  id?: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  title = 'An error occurred',
  message,
  onRetry,
  id = 'error-alert-box',
}) => {
  return (
    <div
      id={id}
      className="flex items-start gap-3.5 p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200 shadow-xs"
    >
      <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
      <div className="flex-1 text-sm">
        <h5 className="font-semibold text-rose-900 dark:text-rose-100">{title}</h5>
        <p className="mt-0.5 text-xs text-rose-700 dark:text-rose-300">{message}</p>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="border-rose-300 text-rose-800 hover:bg-rose-100 dark:border-rose-800 dark:text-rose-200 dark:hover:bg-rose-900/50"
        >
          Retry
        </Button>
      )}
    </div>
  );
};
