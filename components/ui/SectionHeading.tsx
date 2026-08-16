import React from 'react';

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  lightMode?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  subtitle,
  title,
  description,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${centered ? 'text-center max-w-3xl mx-auto' : ''} ${className}`}>
      {subtitle && (
        <div className={`eyebrow-tag ${centered ? 'justify-center' : ''}`}>
          <span className="h-px w-6 bg-[#9E7B47]/40" />
          <span>{subtitle}</span>
          {centered && <span className="h-px w-6 bg-[#9E7B47]/40" />}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium tracking-tight leading-[1.12] text-[#1C1917]">
        {title}
      </h2>

      {description && (
        <p className={`text-xs sm:text-sm text-[#6B635B] font-normal leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}

      <div className={`h-px w-8 bg-[#9E7B47]/50 ${centered ? 'mx-auto' : ''} pt-1`} />
    </div>
  );
};
