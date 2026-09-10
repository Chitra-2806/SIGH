import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  id?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  id = 'empty-state-view',
}) => {
  return (
    <div
      id={id}
      className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl my-4 bg-[#EEF3EF]/40 dark:bg-[#2B332E]/40"
    >
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#EEF3EF] text-[#426B5A] dark:bg-[#343D37] dark:text-[#8FAF9A] mb-4 shadow-xs border border-[#8FAF9A]/30">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <h4 className="text-base font-semibold text-[#303530] dark:text-[#F5F3EA] mb-1">
        {title}
      </h4>
      <p className="text-sm text-[#5C6B61] dark:text-[#B0ACA0] max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} id="btn-empty-state-action">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
