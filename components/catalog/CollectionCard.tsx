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
    <div className="group relative rounded-xl overflow-hidden shadow-card hover:shadow-floating transition-all duration-700 bg-brand-charcoal h-96 flex flex-col justify-end border border-brand-border-dark">
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />

      <div className="relative z-10 p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="h-[1px] w-4 bg-brand-brass" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-brand-brass font-sans">
            Curated Series
          </span>
        </div>
        <h3
          className="text-2xl sm:text-3xl font-bold text-white tracking-tight group-hover:text-brand-brass-light transition-colors"
          style={{ fontFamily: "var(--font-serif), 'Cormorant Garamond', serif" }}
        >
          {collection.name}
        </h3>
        <p className="text-xs text-slate-300 font-light line-clamp-2 leading-relaxed font-sans">
          {collection.description}
        </p>

        <div className="pt-2">
          <Link
            href={`/products?collection=${collection.slug}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white/10 hover:bg-gradient-to-r hover:from-brand-brass hover:to-brand-brass-dark text-white text-xs font-semibold uppercase tracking-wider rounded backdrop-blur-md transition-all duration-300 shadow"
          >
            <span>Explore Collection</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
