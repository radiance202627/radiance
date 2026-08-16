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
    <div className="group relative rounded-[6px] overflow-hidden transition-all duration-700 bg-[#F3F0E8] h-96 flex flex-col justify-end border border-[#E6E1D7] hover:border-[#9E7B47]/50">
      <Image
        src={collection.image}
        alt={collection.name}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center img-luxury-zoom opacity-80 group-hover:opacity-95"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/85 via-[#1C1917]/35 to-transparent" />

      <div className="relative z-10 p-8 space-y-3 font-sans">
        <div className="eyebrow-tag">
          <span className="h-px w-4 bg-[#9E7B47]" />
          <span className="text-[#9E7B47]">Curated Hardware Series</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#FAF8F5] tracking-tight group-hover:text-[#D9C4A5] transition-colors">
          {collection.name}
        </h3>
        <p className="text-xs text-[#FAF8F5]/80 font-normal line-clamp-2 leading-relaxed">
          {collection.description}
        </p>

        <div className="pt-2">
          <Link
            href={`/products?collection=${collection.slug}`}
            className="btn-luxury-primary"
          >
            <span>Explore Collection</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
