import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Collection } from '@/lib/types';
import { ArrowUpRight } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-sm transition-all duration-700 bg-[#F4F2ED] h-96 flex flex-col justify-end border border-[#E5E2DA] hover:border-[#B08D57]/40">
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center img-luxury-zoom opacity-70 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/80 via-[#222222]/40 to-transparent" />

      <div className="relative z-10 p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-px w-4 bg-[#B08D57]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B08D57] font-sans">
            Curated Architectural Series
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF9F6] tracking-tight group-hover:text-[#C5A065] transition-colors">
          {collection.name}
        </h3>
        <p className="text-xs text-[#FAF9F6]/90 font-normal line-clamp-2 leading-relaxed font-sans">
          {collection.description}
        </p>

        <div className="pt-2">
          <Link
            href={`/products?collection=${collection.slug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#B08D57] hover:bg-[#9A7B4B] text-[#FAF9F6] text-xs font-sans font-medium uppercase tracking-wider rounded-[8px] transition-colors duration-200"
          >
            <span>Explore Collection</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
