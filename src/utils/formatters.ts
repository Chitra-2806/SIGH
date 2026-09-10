import { InspectionStatus } from '../types';

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getStatusColorClass(status: InspectionStatus): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (status) {
    case 'COMPLIANT':
    case 'Compliant':
      return {
        bg: 'bg-[#EAF2ED] dark:bg-[#23352B]',
        text: 'text-[#2C493D] dark:text-[#C4E2D0]',
        border: 'border-[#8FAF9A]/60 dark:border-[#4A6E59]',
        badge: 'bg-[#D5E2D9] text-[#2C493D] dark:bg-[#2E4638] dark:text-[#C4E2D0]',
        dot: 'bg-[#426B5A] dark:bg-[#6F9B84]',
      };
    case 'POTENTIAL NON-COMPLIANCE':
    case 'Minor Violation':
      return {
        bg: 'bg-[#F6F0E4] dark:bg-[#3B3426]',
        text: 'text-[#6B4E23] dark:text-[#E8D5B0]',
        border: 'border-[#D8C79B] dark:border-[#8E7C4F]',
        badge: 'bg-[#EBE2CE] text-[#6B4E23] dark:bg-[#4A412F] dark:text-[#E8D5B0]',
        dot: 'bg-[#8A6730] dark:bg-[#D8C79B]',
      };
    case 'REQUIRES OFFICER REVIEW':
    case 'Major Non-Compliance':
    case 'Seizure Recommended':
    default:
      return {
        bg: 'bg-[#F2EFE9] dark:bg-[#323834]',
        text: 'text-[#4D534E] dark:text-[#DCD7CC]',
        border: 'border-[#D2CBC0] dark:border-[#545D56]',
        badge: 'bg-[#E3DFD5] text-[#4D534E] dark:bg-[#3F4640] dark:text-[#DCD7CC]',
        dot: 'bg-[#707A72] dark:bg-[#9FAAA1]',
      };
  }
}

export function getScoreColor(score: number): string {
  // Compliant: Forest Teal / Sage
  if (score >= 85) return 'text-[#426B5A] dark:text-[#6F9B84]';
  // Potential Non-Compliance: Muted Wheat / Earthy Brown
  if (score >= 60) return 'text-[#735624] dark:text-[#D8C79B]';
  // Requires Officer Review: Calm earthy dark brown (never bright red or pale pink)
  return 'text-[#633C33] dark:text-[#E2ADA2]';
}
