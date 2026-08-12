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
  lightMode = false,
}) => {
  return (
    <div className={`space-y-3 ${centered ? 'text-center max-w-3xl mx-auto' : ''} ${className}`}>
      {subtitle && (
        <div className={`flex items-center gap-2.5 text-[11px] font-medium tracking-[0.22em] uppercase ${centered ? 'justify-center' : ''} text-amber-500/90`}>
          <span className="h-px w-5 bg-amber-500/40" />
          <span>{subtitle}</span>
          {centered && <span className="h-px w-5 bg-amber-500/40" />}
        </div>
      )}

      <h2
        className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-[1.15] text-stone-100"
      >
        {title}
      </h2>

      {description && (
        <p className={`text-sm sm:text-base font-normal leading-relaxed max-w-2xl text-stone-400 ${centered ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}

      <div className={`h-px w-10 bg-amber-500/40 ${centered ? 'mx-auto' : ''} mt-3`} />
    </div>
  );
};
