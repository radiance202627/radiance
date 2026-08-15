import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="/" className={`flex items-center gap-3 group transition-transform duration-300 ${className}`}>
      <div className="flex flex-col">
        <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#222222] group-hover:text-[#B08D57] transition-colors leading-none">
          Radiance
        </span>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="h-px w-3 bg-[#B08D57]/50" />
          <span className="text-[9px] tracking-[0.24em] uppercase font-sans font-semibold text-[#B08D57]">
            Architectural Hardware
          </span>
          <span className="h-px w-3 bg-[#B08D57]/50" />
        </div>
      </div>
    </Link>
  );
};
