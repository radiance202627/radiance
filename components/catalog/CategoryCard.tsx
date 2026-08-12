import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <div className="group bg-white rounded-lg border border-brand-border/80 hover:border-brand-brass/50 shadow-card hover:shadow-floating transition-all duration-500 flex flex-col h-full overflow-hidden">
      
      {/* Category Image Header */}
      <div className="relative aspect-[16/10] bg-brand-slate overflow-hidden">
        <Image
          src={category.heroImage}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/30 to-transparent" />
        
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-[1px] w-4 bg-brand-brass" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-brass-light font-sans">
              Series Collection
            </span>
          </div>
          <h3
            className="font-bold text-2xl text-white tracking-tight group-hover:text-brand-brass-light transition-colors"
            style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif" }}
          >
            {category.name}
          </h3>
        </div>
      </div>

      {/* Category Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-brand-text-muted leading-relaxed line-clamp-3 font-light">
          {category.description}
        </p>

        {/* Subcategories list snippet */}
        {category.subcategories.length > 0 && (
          <div className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-100 font-sans">
            <p className="font-semibold text-brand-dark text-[10px] uppercase tracking-wider">
              Subcategory Range:
            </p>
            <p className="line-clamp-1 text-slate-600 font-light">
              {category.subcategories.slice(0, 4).map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}

        <div className="pt-3 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium font-sans">
            {category.subcategories.length} Spec Designs
          </span>

          <Link
            href={`/products/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-brass hover:text-brand-brass-dark transition-colors group/link font-sans"
          >
            <span>Explore Range</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
