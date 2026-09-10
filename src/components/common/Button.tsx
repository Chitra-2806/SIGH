import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'wheat';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  id,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#426B5A] hover:bg-[#507C6B] active:bg-[#345749] text-[#FFFFFF] shadow-xs focus:ring-[#426B5A]/40 dark:bg-[#6F9B84] dark:hover:bg-[#80A893] dark:text-[#FFFFFF] dark:font-semibold',
    secondary:
      'bg-white hover:bg-[#F4F1E9] text-[#426B5A] border border-[#E8E1D2] focus:ring-[#426B5A]/30 dark:bg-transparent dark:hover:bg-[#343D37] dark:text-[#8FAF9A] dark:border-[#3F4A43]',
    wheat:
      'bg-[#F6F0E4] hover:bg-[#EBE2CE] text-[#6B4E23] border border-[#D8C79B] font-semibold focus:ring-[#D8C79B]/40 dark:bg-[#3C3626] dark:hover:bg-[#4A412F] dark:text-[#EFE2BE]',
    outline:
      'border border-[#E8E1D2] dark:border-[#3F4A43] text-[#4A534B] dark:text-[#D4D0C5] bg-white dark:bg-[#2B332E] hover:bg-[#FAF9F5] hover:text-[#303530] dark:hover:bg-[#343D37] hover:border-[#8FAF9A] dark:hover:border-[#8FAF9A] focus:ring-[#426B5A]/30',
    danger:
      'bg-[#8F4336] hover:bg-[#78362B] active:bg-[#632C23] text-[#FFFFFF] focus:ring-[#8F4336]/40 dark:bg-[#7A3F36] dark:hover:bg-[#8F4336]',
    ghost:
      'text-[#66706A] dark:text-[#D4D0C5] hover:text-[#303530] dark:hover:text-[#F5F3EA] hover:bg-[#F4F1E9] dark:hover:bg-[#343D37] focus:ring-[#8FAF9A]/30',
  };

  return (
    <button
      id={id || (props.name ? `btn-${props.name}` : undefined)}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
