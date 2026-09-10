import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'wheat';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
  };

  const variantClasses = {
    success:
      'bg-[#EAF2ED] text-[#2C493D] border border-[#8FAF9A]/60 dark:bg-[#23352B] dark:text-[#C4E2D0] dark:border-[#4A6E59]',
    warning:
      'bg-[#F7F3E7] text-[#59481E] border border-[#D8C79B] dark:bg-[#3C3626] dark:text-[#EFE2BE] dark:border-[#8E7C4F]',
    danger:
      'bg-[#F8ECE8] text-[#683025] border border-[#D8A59B] dark:bg-[#3E2926] dark:text-[#F2C7BF] dark:border-[#854E46]',
    info:
      'bg-[#EAF0F2] text-[#2D4D54] border border-[#9BBEC7] dark:bg-[#26373D] dark:text-[#C1DFE6] dark:border-[#43646C]',
    wheat:
      'bg-[#F7F3E7] text-[#59481E] border border-[#D8C79B] dark:bg-[#3C3626] dark:text-[#EFE2BE] dark:border-[#8E7C4F]',
    neutral:
      'bg-[#F4EFE6] text-[#303530] border border-[#E8E1D2] dark:bg-[#343D37] dark:text-[#D2CDC0] dark:border-[#3A443E]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
