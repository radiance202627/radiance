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
    <div className="group bg-[#F4F2ED] rounded-2xl border border-[#E5E2DA] hover:border-[#B08D57]/40 shadow-sm transition-all duration-500 flex flex-col h-full overflow-hidden">
      {/* Category Image Header */}
      <div className="relative aspect-[16/10] bg-[#FAF9F6] overflow-hidden border-b border-[#E5E2DA]">
        <Image
          src={category.heroImage}
          alt={`${category.name} - Handcrafted Solid Brass & Architectural Hardware Range`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center img-luxury-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/70 via-[#222222]/20 to-transparent" />

        <div className="absolute bottom-4 left-5 right-5 text-[#FAF9F6]">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-px w-4 bg-[#B08D57]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B08D57]">
              Hardware Series
            </span>
          </div>
          <h3 className="font-serif font-bold text-2xl text-[#FAF9F6] tracking-tight group-hover:text-[#C5A065] transition-colors">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Category Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <p className="text-xs text-[#666666] leading-relaxed line-clamp-3 font-normal">
          {category.description}
        </p>

        {/* Subcategories list snippet */}
        {category.subcategories.length > 0 && (
          <div className="text-[11px] text-[#666666] space-y-1.5 pt-3 border-t border-[#E5E2DA] font-sans">
            <p className="font-semibold text-[#222222] text-[10px] uppercase tracking-wider">
              Subcategory Range:
            </p>
            <p className="line-clamp-1 text-[#666666] font-normal">
              {category.subcategories.slice(0, 4).map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}

        <div className="pt-3 flex items-center justify-between border-t border-[#E5E2DA]">
          <span className="text-[11px] text-[#666666] font-medium font-sans">
            {category.subcategories.length} Spec Series
          </span>

          <Link
            href={`/products/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#B08D57] hover:text-[#9A7B4B] transition-colors group/link font-sans"
          >
            <span>Explore Range</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
