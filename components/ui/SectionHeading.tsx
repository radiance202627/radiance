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
    <div className={`space-y-3 ${centered ? 'text-center max-w-3xl mx-auto' : ''} ${className}`}>
      {subtitle && (
        <div className={`flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.22em] uppercase ${centered ? 'justify-center' : ''} text-[#B08D57]`}>
          <span className="h-px w-5 bg-[#B08D57]/40" />
          <span>{subtitle}</span>
          {centered && <span className="h-px w-5 bg-[#B08D57]/40" />}
        </div>
      )}

      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-[1.15] text-[#222222]"
      >
        {title}
      </h2>

      {description && (
        <p className={`text-sm sm:text-base font-normal leading-relaxed max-w-2xl text-[#666666] ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}

      <div className={`h-px w-10 bg-[#B08D57]/50 ${centered ? 'mx-auto' : ''} mt-3`} />
    </div>
  );
};
