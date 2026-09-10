import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  helperText?: string;
  error?: string;
  id: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  helperText,
  error,
  id,
  className = '',
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
      <select
        id={id}
        className={`w-full rounded-lg text-xs sm:text-sm bg-white dark:bg-[#2B332E] border transition-colors focus:outline-none focus:ring-2 px-3.5 py-2 cursor-pointer ${
          error
            ? 'border-[#D8A59B] dark:border-[#854E46] focus:border-[#735624] focus:ring-[#D8C79B]/40 text-[#6B4E23] dark:text-[#E8D5B0]'
            : 'border-[#E8E1D2] dark:border-[#3F4A43] text-[#303530] dark:text-[#F5F3EA] focus:border-[#426B5A] dark:focus:border-[#6F9B84] focus:ring-[#426B5A]/20 dark:focus:ring-[#6F9B84]/20'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      ) : null}
    </div>
  );
};
