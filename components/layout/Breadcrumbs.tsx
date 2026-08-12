import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-brand-text-muted">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-brand-brass transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-brand-brass transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-brand-dark font-semibold line-clamp-1">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
