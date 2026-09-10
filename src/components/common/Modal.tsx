import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  id?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'md',
  id = 'modal-container',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div
      id={id}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-2xl shadow-xl overflow-hidden text-[#303530] dark:text-[#F5F3EA] transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] bg-[#FAF9F5] dark:bg-[#202622]">
          <div>
            <h3 className="text-lg font-semibold text-[#303530] dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-[#5C6B61] dark:text-[#C5C2B8] mt-0.5">{subtitle}</p>}
          </div>
          <button
            id="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-[#5C6B61] hover:text-[#303530] dark:text-slate-400 dark:hover:text-slate-200 hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 max-h-[75vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-3 p-4 bg-[#FAF9F5] dark:bg-[#202622] border-t border-[#E8E1D2] dark:border-[#3F4A43]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
