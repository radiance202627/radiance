import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link
      href="/"
      className={`inline-flex items-center group transition-transform duration-300 ${className}`}
      aria-label="SB PATTERN WORKS Home"
    >
      <Image
        src="/logo.png"
        alt="SB PATTERN WORKS Architectural Hardware & Custom Foundry"
        width={255}
        height={85}
        priority
        className="h-[85px] w-auto object-contain transition-all duration-300 group-hover:scale-[1.02]"
      />
    </Link>
  );
};
