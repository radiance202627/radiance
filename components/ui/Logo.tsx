import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '' }) => {
  const isDark = variant === 'dark';

  return (
    <Link href="/" className={`flex items-center gap-3 group transition-transform duration-300 ${className}`}>
      <div className="flex flex-col">
        <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-100 group-hover:text-amber-400 transition-colors leading-none">
          Radiance
        </span>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="h-px w-3 bg-amber-400/50" />
          <span className="text-[9px] tracking-[0.24em] uppercase font-sans font-semibold text-amber-400">
            Architectural Hardware
          </span>
          <span className="h-px w-3 bg-amber-400/50" />
        </div>
      </div>
    </Link>
  );
};
