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
    <div className="group bg-stone-900 rounded-2xl border border-stone-800 hover:border-amber-500/30 shadow-xl transition-all duration-500 flex flex-col h-full overflow-hidden">
      {/* Category Image Header */}
      <div className="relative aspect-[16/10] bg-stone-950 overflow-hidden">
        <Image
          src={category.heroImage}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center img-luxury-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

        <div className="absolute bottom-4 left-5 right-5 text-stone-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-px w-4 bg-amber-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-400">
              Hardware Series
            </span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-stone-100 tracking-tight group-hover:text-amber-400 transition-colors">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Category Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-stone-400 leading-relaxed line-clamp-3 font-normal">
          {category.description}
        </p>

        {/* Subcategories list snippet */}
        {category.subcategories.length > 0 && (
          <div className="text-[11px] text-stone-400 space-y-1.5 pt-3 border-t border-stone-800/80 font-sans">
            <p className="font-semibold text-stone-300 text-[10px] uppercase tracking-wider">
              Subcategory Range:
            </p>
            <p className="line-clamp-1 text-stone-400 font-normal">
              {category.subcategories.slice(0, 4).map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}

        <div className="pt-3 flex items-center justify-between border-t border-stone-800/60">
          <span className="text-[11px] text-stone-500 font-medium font-sans">
            {category.subcategories.length} Spec Series
          </span>

          <Link
            href={`/products/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors group/link font-sans"
          >
            <span>Explore Range</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
