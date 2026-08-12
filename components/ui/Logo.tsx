import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '' }) => {
  const isDark = variant === 'dark';

  return (
    <Link href="/" className={`flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02] ${className}`}>
      <div className="flex flex-col">
        <span
          className={`text-2xl sm:text-3xl font-bold tracking-tight italic transition-colors leading-none ${
            isDark ? 'text-white group-hover:text-brand-brass-light' : 'text-brand-dark group-hover:text-brand-brass'
          }`}
          style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Radience
        </span>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="h-[1px] w-3 bg-brand-brass opacity-60" />
          <span className="text-[9px] tracking-[0.25em] uppercase font-sans font-semibold text-brand-brass">
            Architectural Hardware
          </span>
          <span className="h-[1px] w-3 bg-brand-brass opacity-60" />
        </div>
      </div>
    </Link>
  );
};
