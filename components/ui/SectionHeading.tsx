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
    <div className={`space-y-2.5 ${centered ? 'text-center max-w-3xl mx-auto' : ''} ${className}`}>
      {subtitle && (
        <div className={`flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase font-sans ${centered ? 'justify-center' : ''} text-brand-brass`}>
          <span className="h-[1px] w-4 bg-brand-brass/60" />
          <span>{subtitle}</span>
          <span className="h-[1px] w-4 bg-brand-brass/60" />
        </div>
      )}

      <h2
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${
          lightMode ? 'text-white' : 'text-brand-dark'
        }`}
        style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif" }}
      >
        {title}
      </h2>

      {description && (
        <p className={`text-sm sm:text-base font-light leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${
          lightMode ? 'text-slate-300' : 'text-brand-text-muted'
        }`}>
          {description}
        </p>
      )}

      <div className={`h-[1.5px] w-12 bg-gradient-to-r from-brand-brass via-brand-brass-light to-transparent ${centered ? 'mx-auto' : ''} mt-4`} />
    </div>
  );
};
