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
    <div className="group bg-[#F3F0E8] rounded-[6px] border border-[#E6E1D7] hover:border-[#9E7B47]/40 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col h-full overflow-hidden">
      {/* Category Image Header Stage */}
      <div className="relative aspect-[16/10] bg-[#FAF8F5] overflow-hidden border-b border-[#E6E1D7]">
        <Image
          src={category.heroImage}
          alt={`${category.name} - Handcrafted Architectural Hardware Range`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center img-luxury-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/60 via-[#1C1917]/10 to-transparent" />

        <div className="absolute bottom-4 left-5 right-5 text-[#FAF8F5]">
          <div className="eyebrow-tag mb-1">
            <span className="h-px w-4 bg-[#9E7B47]" />
            <span className="text-[#9E7B47]">Hardware Series</span>
          </div>
          <h3 className="font-serif font-medium text-2xl text-[#FAF8F5] tracking-tight group-hover:text-[#D9C4A5] transition-colors">
            {category.name}
          </h3>
        </div>
      </div>

      {/* Category Details Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4 font-sans">
        <p className="text-xs text-[#6B635B] leading-relaxed line-clamp-3 font-normal">
          {category.description}
        </p>

        {/* Subcategories list snippet */}
        {category.subcategories.length > 0 && (
          <div className="text-[11px] text-[#6B635B] space-y-1.5 pt-3 border-t border-[#E6E1D7]">
            <p className="font-semibold text-[#1C1917] text-[10px] uppercase tracking-[0.18em]">
              Spec Series:
            </p>
            <p className="line-clamp-1 text-[#6B635B] font-normal">
              {category.subcategories.slice(0, 4).map((s) => s.name).join(' • ')}
            </p>
          </div>
        )}

        <div className="pt-3 flex items-center justify-between border-t border-[#E6E1D7]">
          <span className="text-[11px] text-[#6B635B] font-medium">
            {category.subcategories.length} Sub-Categories
          </span>

          <Link
            href={`/products/${category.slug}`}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9E7B47] hover:text-[#856637] transition-colors group/link"
          >
            <span>Explore Range</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[1.5] group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
