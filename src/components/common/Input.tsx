import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  id: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-[#303530] dark:text-[#F5F3EA] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-[#4A534B] dark:text-[#D4D0C5]">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          disabled={disabled}
          className={`w-full rounded-lg text-xs sm:text-sm bg-white dark:bg-[#2B332E] border transition-colors focus:outline-none focus:ring-2 disabled:bg-[#F4EFE6] dark:disabled:bg-[#343D37] disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : 'pl-3.5'
          } ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2 ${
            error
              ? 'border-[#D8A59B] dark:border-[#854E46] focus:border-[#735624] focus:ring-[#D8C79B]/40 text-[#6B4E23] dark:text-[#E8D5B0]'
              : 'border-[#E8E1D2] dark:border-[#3F4A43] text-[#303530] dark:text-[#F5F3EA] focus:border-[#426B5A] dark:focus:border-[#6F9B84] focus:ring-[#426B5A]/20 dark:focus:ring-[#6F9B84]/20'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-[#4A534B] dark:text-[#D4D0C5]">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-[#735624] dark:text-[#E8D5B0]">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-[#565E57] dark:text-[#B0ACA0]">{helperText}</p>
      ) : null}
    </div>
  );
};
