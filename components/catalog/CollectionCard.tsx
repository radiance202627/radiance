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
    <div className="group relative rounded-2xl overflow-hidden shadow-xl transition-all duration-700 bg-stone-900 h-96 flex flex-col justify-end border border-stone-800 hover:border-amber-500/30">
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center img-luxury-zoom opacity-50 group-hover:opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

      <div className="relative z-10 p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-px w-4 bg-amber-400" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-amber-400 font-sans">
            Curated Architectural Series
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100 tracking-tight group-hover:text-amber-400 transition-colors">
          {collection.name}
        </h3>
        <p className="text-xs text-stone-300 font-normal line-clamp-2 leading-relaxed font-sans">
          {collection.description}
        </p>

        <div className="pt-2">
          <Link
            href={`/products?collection=${collection.slug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md font-sans"
          >
            <span>Explore Collection</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
