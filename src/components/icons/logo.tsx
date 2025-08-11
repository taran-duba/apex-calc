import React from 'react';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-2 font-headline', className)}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M4 4H8V8H4V4ZM8 8H12V12H8V8ZM12 4H16V8H12V4ZM4 12H8V16H4V12ZM12 12H16V16H12V12ZM16 8H20V12H16V8ZM8 16H12V20H8V16Z"
        fill="currentColor"
      />
    </svg>
    <span className="text-2xl font-bold text-foreground">ApexCalc</span>
  </div>
);
