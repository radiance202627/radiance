import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link href="/" className={`inline-flex items-center group transition-transform duration-300 ${className}`}>
      <img
        src="/logo.png"
        alt="SB PATTERN WORKS"
        className="h-[75px] sm:h-[100px] w-auto object-contain transition-all duration-300"
      />
    </Link>
  );
};
