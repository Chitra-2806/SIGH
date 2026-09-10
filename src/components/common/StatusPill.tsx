import React from 'react';
import { InspectionStatus } from '../../types';
import { getStatusColorClass } from '../../utils/formatters';

interface StatusPillProps {
  status: InspectionStatus | 'on-duty' | 'off-duty' | 'on-leave';
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  if (status === 'on-duty' || status === 'off-duty' || status === 'on-leave') {
    const config = {
      'on-duty': {
        label: 'On Duty (Active)',
        bg: 'bg-[#EAF2ED] dark:bg-[#23352B]',
        text: 'text-[#2C493D] dark:text-[#C4E2D0]',
        border: 'border-[#8FAF9A]/60 dark:border-[#4A6E59]',
        dot: 'bg-[#426B5A] dark:bg-[#6F9B84]',
      },
      'off-duty': {
        label: 'Off Duty',
        bg: 'bg-[#F4EFE6] dark:bg-[#343D37]',
        text: 'text-[#565D57] dark:text-[#D2CDC0]',
        border: 'border-[#E8E1D2] dark:border-[#3A443E]',
        dot: 'bg-[#8FAF9A] dark:bg-[#565D57]',
      },
      'on-leave': {
        label: 'On Leave',
        bg: 'bg-[#F7F3E7] dark:bg-[#3C3626]',
        text: 'text-[#59481E] dark:text-[#EFE2BE]',
        border: 'border-[#D8C79B] dark:border-[#8E7C4F]',
        dot: 'bg-[#C8B77F]',
      },
    }[status];

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${
          size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className="capitalize">{config.label}</span>
      </span>
    );
  }

  const color = getStatusColorClass(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${color.bg} ${color.text} ${color.border} ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`} />
      <span>{status}</span>
    </span>
  );
};
