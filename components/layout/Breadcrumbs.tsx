import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateBreadcrumbSchema } from '@/lib/seo/schema';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const schemaItems = items.map((i) => ({
    name: i.label,
    url: i.href,
  }));
  const breadcrumbSchema = generateBreadcrumbSchema(schemaItems);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <nav aria-label="Breadcrumb" className="py-4 font-sans">
        <ol className="flex items-center flex-wrap gap-1.5 text-xs text-[#666666]">
          <li>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[#B08D57] transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-[#E5E2DA]" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-[#B08D57] transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-[#222222] font-semibold line-clamp-1">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
