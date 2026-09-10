import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  id,
  interactive = false,
  ...props
}) => {
  return (
    <div
      id={id}
      className={`bg-white dark:bg-[#2B332E] border border-[#E8E1D2] dark:border-[#3F4A43] rounded-xl overflow-hidden shadow-xs transition-colors ${
        interactive ? 'hover:border-[#8FAF9A] dark:hover:border-[#6F9B84] cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`p-4 sm:p-5 border-b border-[#E8E1D2] dark:border-[#3F4A43] bg-white dark:bg-[#2B332E] ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`font-semibold text-[#303530] dark:text-[#F5F3EA] ${className}`} {...props}>
    {children}
  </h3>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 sm:p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div
    className={`p-4 sm:p-5 bg-[#E8E1D2]/30 dark:bg-[#343D37] border-t border-[#E8E1D2] dark:border-[#3F4A43] ${className}`}
    {...props}
  >
    {children}
  </div>
);
